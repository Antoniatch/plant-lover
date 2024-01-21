import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Comment } from "../entities/Comment";
import type { Comment as PrismaComment } from "@prisma/client";
import { prisma } from "../server";
import { CreateCommentInput } from "../types/CommentTypes";
import { GraphQLError } from "graphql";
import { catchPrismaError } from "../utils/catchPrismaError";
import { IContext } from "../types/interfaces";
import { authenticationCheck } from "../utils/authenticationCheck";

@Resolver()
export class CommentResolver {
    @Query(() => Number)
    async getNumberOfComments(
        @Arg("field") field: "plantId" | "UserPlantId" | "observationId",
        @Arg("fieldId") fieldId: string,
    ): Promise<number> {
        const numberOfcomments = await prisma.comment.count({
            where: {
                [field]: fieldId,
            },
        });

        return numberOfcomments;
    }

    @Query(() => [Comment])
    async getAllComments(): Promise<PrismaComment[]> {
        try {
            const comments = await prisma.comment.findMany({
                include: {
                    likes: true,
                },
            });

            return comments;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Comment])
    async getAllObservationComments(
        @Arg("observationId") observationId: string,
        @Ctx() ctx: IContext,
    ): Promise<PrismaComment[]> {
        try {
            authenticationCheck(ctx);

            const observationComments = await prisma.comment.findMany({
                where: {
                    observationId,
                },
                include: {
                    likes: true,
                },
            });

            return observationComments;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Comment])
    async getAllUserPlantComments(
        @Arg("userPlantId") userPlantId: string,
        @Ctx() ctx: IContext,
    ): Promise<PrismaComment[]> {
        try {
            authenticationCheck(ctx);

            const userPlantComments = await prisma.comment.findMany({
                where: {
                    userPlantId,
                },
                include: {
                    likes: true,
                },
            });

            return userPlantComments;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Comment])
    async getAllPlantComments(@Arg("plantId") plantId: string): Promise<PrismaComment[]> {
        try {
            const plantComments = await prisma.comment.findMany({
                where: {
                    plantId,
                },
                include: {
                    likes: true,
                },
            });

            return plantComments;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => Comment)
    async getOneComment(@Arg("id") id: string, @Ctx() ctx: IContext): Promise<PrismaComment> {
        try {
            const comment = await prisma.comment.findUnique({
                where: {
                    id,
                },
                include: {
                    likes: true,
                },
            });

            if (!comment) throw new GraphQLError("Ce commentaire n'existe pas");

            if (comment.observationId || comment.userPlantId) authenticationCheck(ctx);

            return comment;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => Comment)
    async createComment(
        @Arg("data") data: CreateCommentInput,
        @Ctx() ctx: IContext,
    ): Promise<PrismaComment> {
        try {
            const userFromContext = authenticationCheck(ctx);

            const authorId = userFromContext.id;
            const { text, observationId, userPlantId, plantId } = data;

            if (!observationId && !userPlantId && !plantId)
                throw new GraphQLError(
                    "Ce commentaire n'est associé à aucune observation, plante d'utilisateur, ou plante",
                );

            if (data.observationId) {
                const observation = await prisma.observation.findUnique({
                    where: {
                        id: data.observationId,
                    },
                });

                if (!observation.public)
                    throw new GraphQLError(
                        "Cette observation est privée, les commentaires n'y sont pas autorisés",
                    );
            }

            const myData = observationId
                ? {
                      text,
                      author: {
                          connect: {
                              id: authorId,
                          },
                      },
                      observation: {
                          connect: {
                              id: observationId,
                          },
                      },
                  }
                : userPlantId
                  ? {
                        text,
                        author: {
                            connect: {
                                id: authorId,
                            },
                        },
                        userPlant: {
                            connect: {
                                id: userPlantId,
                            },
                        },
                    }
                  : {
                        text,
                        author: {
                            connect: {
                                id: authorId,
                            },
                        },
                        plant: {
                            connect: {
                                id: plantId,
                            },
                        },
                    };

            const newComment = await prisma.comment.create({
                data: myData,
                include: {
                    likes: true,
                },
            });

            return newComment;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
