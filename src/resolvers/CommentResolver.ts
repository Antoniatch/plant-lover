import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Comment } from "../entities/Comment";
import type { Comment as PrismaComment } from "@prisma/client";
import { prisma } from "../server";
import { CreateCommentInput } from "../types/CommentTypes";
import { GraphQLError } from "graphql";
import { catchPrismaError } from "../utils/catchPrismaError";
import { IContext } from "../types/interfaces";

@Resolver()
export class CommentResolver {
    @Query(() => [Comment])
    async getAllComments(): Promise<PrismaComment[]> {
        try {
            const comments = await prisma.comment.findMany();

            return comments;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Comment])
    async getAllObservationComments(
        @Arg("observationId") observationId: string,
    ): Promise<PrismaComment[]> {
        try {
            const observationComments = await prisma.comment.findMany({
                where: {
                    observationId,
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
    ): Promise<PrismaComment[]> {
        try {
            const userPlantComments = await prisma.comment.findMany({
                where: {
                    userPlantId,
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
            });

            return plantComments;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => Comment)
    async getOneComment(@Arg("id") id: string): Promise<PrismaComment> {
        try {
            const comment = await prisma.comment.findUnique({
                where: {
                    id,
                },
            });

            if (!comment) throw new GraphQLError("Ce commentaire n'existe pas");

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
            const userFromContext = ctx.user;

            if (!userFromContext) throw new GraphQLError("Utilisateur non authentifié");

            const authorId = userFromContext.id;
            const { text, observationId, userPlantId, plantId } = data;

            if (!observationId && !userPlantId && !plantId)
                throw new GraphQLError(
                    "Ce commentaire n'est associé à aucune observation, plante d'utilisateur, ou plante",
                );

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
            });

            return newComment;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
