import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Plant } from "../entities/Plant";
import type { Plant as PrismaPlant } from "@prisma/client";
import { prisma } from "../server";
import { catchPrismaError } from "../utils/catchPrismaError";
import { GraphQLError } from "graphql";
import { CreatePlantInput, idInput } from "../types/PlantTypes";

@Resolver()
export class PlantResolver {
    @Query(() => [Plant])
    async getAllPlants(): Promise<PrismaPlant[]> {
        try {
            const plants = await prisma.plant.findMany({
                include: {
                    userPlants: true,
                    mixes: true,
                },
            });

            return plants;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => Plant)
    async getOneUserPlant(@Arg("id") id: string): Promise<PrismaPlant> {
        try {
            const plant = await prisma.plant.findUnique({
                where: {
                    id,
                },
                include: {
                    mixes: true,
                    userPlants: true,
                },
            });

            if (!plant) throw new GraphQLError("Cette plante n'existe pas");
            else return plant;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => Plant)
    async createPlant(@Arg("data") data: CreatePlantInput, @Arg("familyId") familyId: string, @Arg("mixIds", () => [idInput]) mixIds: idInput[]): Promise<PrismaPlant> {
        try {
            const newPlant = await prisma.plant.create({
                data: {
                    ...data,
                    family: {
                        connect: {
                            id: familyId,
                        },
                    },
                    mixes: {
                        connect: mixIds,
                    },
                },
                include: {
                    mixes: true,
                    userPlants: true,
                },
            });

            return newPlant;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
