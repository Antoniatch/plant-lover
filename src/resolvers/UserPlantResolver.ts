import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserPlant } from "../entities/userPlant";
import type { UserPlant as PrismaUserPlant } from "@prisma/client";
import { prisma } from "../server";
import { catchPrismaError } from "../utils/catchPrismaError";
import { GraphQLError } from "graphql";
import { CreateUserPlantInput } from "../types/UserPlantTypes";
import { IContext } from "../types/interfaces";
import { authenticationCheck } from "../utils/authenticationCheck";

@Resolver()
export class UserPlantResolver {
    @Query(() => [UserPlant])
    async getAllUserPlants(@Ctx() ctx: IContext): Promise<PrismaUserPlant[]> {
        try {
            authenticationCheck(ctx);

            const userPlants = await prisma.userPlant.findMany({
                include: {
                    observations: true,
                    comments: true,
                    likes: true,
                },
            });

            return userPlants;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => UserPlant)
    async getOneUserPlant(@Arg("id") id: string, @Ctx() ctx: IContext): Promise<PrismaUserPlant> {
        try {
            authenticationCheck(ctx);

            const userPlant = await prisma.userPlant.findUnique({
                where: {
                    id,
                },
                include: {
                    observations: true,
                    comments: true,
                    likes: true,
                },
            });

            if (!userPlant) throw new GraphQLError("Cette plante n'existe pas");
            else return userPlant;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => UserPlant)
    async createUserPlant(
        @Arg("data") data: CreateUserPlantInput,
        @Ctx() ctx: IContext,
    ): Promise<PrismaUserPlant> {
        try {
            const userFromContext = authenticationCheck(ctx);

            if (data.userId !== userFromContext.id)
                throw new GraphQLError(
                    "Accès refusé: vous n'êtes pas le propriétaire de ce profil",
                );

            const newUserPlant = await prisma.userPlant.create({
                data,
                include: {
                    observations: true,
                    comments: true,
                    likes: true,
                },
            });

            return newUserPlant;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
