import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Observation } from "../entities/Observation";
import type { Observation as PrismaObservation } from "@prisma/client";
import { prisma } from "../server";
import { CreateObservationInput } from "../types/ObservationTypes";
import { GraphQLError } from "graphql";
import { catchPrismaError } from "../utils/catchPrismaError";

@Resolver()
export class ObservationResolver {
    @Query(() => [Observation])
    async getAllObservations(): Promise<PrismaObservation[]> {
        try {
            const observations = await prisma.observation.findMany({
                include: {
                    comments: true,
                    likes: true,
                },
            });

            return observations;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => Observation)
    async getOneObservation(@Arg("id") id: string): Promise<PrismaObservation> {
        try {
            const observation = await prisma.observation.findUnique({
                where: {
                    id,
                },
                include: {
                    comments: true,
                    likes: true,
                },
            });

            if (!observation) throw new GraphQLError("Cette observation n'existe pas");

            return observation;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => Observation)
    async createObservation(@Arg("data") data: CreateObservationInput): Promise<PrismaObservation> {
        try {
            const newObservation = await prisma.observation.create({
                data,
                include: {
                    comments: true,
                    likes: true,
                },
            });

            return newObservation;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
