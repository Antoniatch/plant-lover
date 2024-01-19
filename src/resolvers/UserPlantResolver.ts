import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { UserPlant } from "../entities/userPlant";
import type { UserPlant as PrismaUserPlant } from "@prisma/client";
import { prisma } from "../server";
import { catchPrismaError } from "../utils/catchPrismaError";
import { GraphQLError } from "graphql";
import { CreateUserPlantInput } from "../types/UserPlantTypes";

@Resolver()
export class UserPlantResolver {
    @Query(() => [UserPlant])
    async getAllUserPlants(): Promise<PrismaUserPlant[]> {
        try {
            const userPlants = await prisma.userPlant.findMany({
                include: {
                    observations: true,
                },
            });

            return userPlants;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => UserPlant)
    async getOneUserPlant(@Arg("id") id: string): Promise<PrismaUserPlant> {
        try {
            const userPlant = await prisma.userPlant.findUnique({
                where: {
                    id,
                },
                include: {
                    observations: true,
                },
            });

            if (!userPlant) throw new GraphQLError("Cette plante n'existe pas");
            else return userPlant;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => UserPlant)
    async createUserPlant(@Arg("data") data: CreateUserPlantInput): Promise<PrismaUserPlant> {
        try {
            const newUserPlant = await prisma.userPlant.create({
                data,
            });

            return newUserPlant;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
