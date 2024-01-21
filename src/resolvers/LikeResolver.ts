import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Like } from "../entities/Like";
import type { Like as PrismaLike } from "@prisma/client";
import { prisma } from "../server";
import { CreateLikeInput } from "../types/LikeTypes";
import { GraphQLError } from "graphql";
import { catchPrismaError } from "../utils/catchPrismaError";
import { IContext } from "../types/interfaces";
import { connectToUniqueField } from "../utils/connectToUniqueField";
import { authenticationCheck } from "../utils/authenticationCheck";

@Resolver()
export class LikeResolver {
    @Query(() => Number)
    async getNumberOfLikes(
        @Arg("field") field: "userId" | "commentId" | "plantId" | "UserPlantId" | "observationId",
        @Arg("fieldId") fieldId: string,
    ): Promise<number> {
        const numberOflikes = await prisma.like.count({
            where: {
                [field]: fieldId,
            },
        });

        return numberOflikes;
    }

    @Query(() => [Like])
    async getAllLikes(): Promise<PrismaLike[]> {
        try {
            const likes = await prisma.like.findMany();

            return likes;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Like])
    async getAllAuthorLikes(
        @Arg("authorId") authorId: string,
        @Arg("userId") userId: string,
        @Ctx() ctx: IContext,
    ): Promise<PrismaLike[]> {
        try {
            const userFromContext = authenticationCheck(ctx);

            if (userFromContext.id !== userId)
                throw new GraphQLError(
                    "Accès refusé : vous n'êtes pas le propriétaire de ce profil",
                );

            const authorLikes = await prisma.like.findMany({
                where: {
                    authorId,
                },
            });

            return authorLikes;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Like])
    async getAllReceivedLikes(@Arg("userId") userId: string): Promise<PrismaLike[]> {
        try {
            const receivedLikes = await prisma.like.findMany({
                where: {
                    userId,
                },
            });

            return receivedLikes;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Like])
    async getAllObservationLikes(
        @Arg("observationId") observationId: string,
        @Ctx() ctx: IContext,
    ): Promise<PrismaLike[]> {
        try {
            authenticationCheck(ctx);

            const observationLikes = await prisma.like.findMany({
                where: {
                    observationId,
                },
            });

            return observationLikes;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Like])
    async getAllUserPlantLikes(
        @Arg("userPlantId") userPlantId: string,
        @Ctx() ctx: IContext,
    ): Promise<PrismaLike[]> {
        try {
            authenticationCheck(ctx);

            const userPlantLikes = await prisma.like.findMany({
                where: {
                    userPlantId,
                },
            });

            return userPlantLikes;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Like])
    async getAllPlantLikes(@Arg("plantId") plantId: string): Promise<PrismaLike[]> {
        try {
            const plantLikes = await prisma.like.findMany({
                where: {
                    plantId,
                },
            });

            return plantLikes;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Like])
    async getAllCommentLikes(
        @Arg("commentId") commentId: string,
        @Ctx() ctx: IContext,
    ): Promise<PrismaLike[]> {
        try {
            authenticationCheck(ctx);

            const commentLikes = await prisma.like.findMany({
                where: {
                    commentId,
                },
            });

            return commentLikes;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => Like)
    async getOneLike(@Arg("id") id: string): Promise<PrismaLike> {
        try {
            const like = await prisma.like.findUnique({
                where: {
                    id,
                },
            });

            if (!like) throw new GraphQLError("Ce like n'existe pas");

            return like;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => Like)
    async createLike(
        @Arg("data") data: CreateLikeInput,
        @Ctx() ctx: IContext,
    ): Promise<PrismaLike> {
        try {
            const userFromContext = ctx.user;

            if (!userFromContext) throw new GraphQLError("Utilisateur non authentifié");

            const authorId = userFromContext.id;
            const { userId, commentId, observationId, userPlantId, plantId } = data;

            if (!userId && !commentId && !observationId && !userPlantId && !plantId)
                throw new GraphQLError(
                    "Ce like n'est associé à aucun utilisateur, commentaire, observation, plante d'utilisateur, ou plante",
                );

            if (data.observationId) {
                const observation = await prisma.observation.findUnique({
                    where: {
                        id: data.observationId,
                    },
                });

                if (!observation.public)
                    throw new GraphQLError(
                        "Cette observation est privée, les likes n'y sont pas autorisés",
                    );
            }

            const myData = observationId
                ? connectToUniqueField(authorId, "observation", observationId)
                : userPlantId
                  ? connectToUniqueField(authorId, "userPlant", userPlantId)
                  : plantId
                    ? connectToUniqueField(authorId, "plant", plantId)
                    : commentId
                      ? connectToUniqueField(authorId, "comment", commentId)
                      : connectToUniqueField(authorId, "user", userId);

            const newLike = await prisma.like.create({
                data: myData,
            });

            return newLike;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
