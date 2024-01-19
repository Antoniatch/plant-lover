import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Observation } from "../entities/Observation";
import type { Observation as PrismaObservation } from "@prisma/client";
import { prisma } from "../server";
import { CreateObservationInput } from "../types/ObservationTypes";
import { GraphQLError } from "graphql";

@Resolver()
export class ObervationResolver {
    @Query(() => [Observation])
    async getAllObservations(): Promise<PrismaObservation[]> {
        const observations = await prisma.observation.findMany({
            include: {
                comments: true,
            },
        });

        return observations;
    }

    @Query(() => Observation)
    async getOneObservation(@Arg("id") id: string): Promise<PrismaObservation> {
        const observation = await prisma.observation.findUnique({
            where: {
                id,
            },
            include: {
                comments: true,
            },
        });

        if (!observation) throw new GraphQLError("Cette observation n'existe pas");

        return observation;
    }

    @Mutation(() => Observation)
    async createObservation(@Arg("data") data: CreateObservationInput): Promise<PrismaObservation> {
        const newObservation = await prisma.observation.create({
            data,
            include: {
                comments: true,
            },
        });

        return newObservation;
    }
}
