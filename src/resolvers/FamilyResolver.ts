import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Family } from "../entities/Family";
import type { Family as PrismaFamily } from "@prisma/client";
import { prisma } from "../server";
import { CreateFamilyInput } from "../types/FamilyTypes";
import { GraphQLError } from "graphql";
import { catchPrismaError } from "../utils/catchPrismaError";

@Resolver()
export class FamilyResolver {
    @Query(() => [Family])
    async getAllFamilies(): Promise<PrismaFamily[]> {
        try {
            const families = await prisma.family.findMany({
                include: {
                    plants: true,
                },
            });

            return families;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => Family)
    async getOneFamily(@Arg("id") id: string): Promise<PrismaFamily> {
        try {
            const family = await prisma.family.findUnique({
                where: {
                    id,
                },
                include: {
                    plants: true,
                },
            });

            if (!family) throw new GraphQLError("Cette famille de plantes n'existe pas");

            return family;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => Family)
    async createFamily(@Arg("data") data: CreateFamilyInput): Promise<PrismaFamily> {
        try {
            const newFamily = await prisma.family.create({
                data,
                include: {
                    plants: true,
                },
            });

            return newFamily;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
