import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Observation } from "../entities/Observation";
import type { Observation as PrismaObservation } from "@prisma/client";
import { prisma } from "../server";
import { CreateObservationInput } from "../types/ObservationTypes";
import { GraphQLError } from "graphql";
import { catchPrismaError } from "../utils/catchPrismaError";
import { authenticationCheck } from "../utils/authenticationCheck";
import { IContext } from "../types/interfaces";

@Resolver()
export class ObservationResolver {
    @Query(() => [Observation])
    async getAllPublicObservations(): Promise<PrismaObservation[]> {
        try {
            const observations = await prisma.observation.findMany({
                where: {
                    public: true,
                },
            });

            return observations;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => [Observation])
    async getAllHelpCenterObservations(): Promise<PrismaObservation[]> {
        try {
            const observations = await prisma.observation.findMany({
                where: {
                    helpCenter: true,
                },
            });

            return observations;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => Observation)
    async getOneObservation(
        @Arg("id") id: string,
        @Ctx() ctx: IContext,
        @Arg("userId", { nullable: true }) userId?: string,
    ): Promise<PrismaObservation> {
        try {
            const userFromContext = authenticationCheck(ctx);

            const observation = await prisma.observation.findUnique({
                where: {
                    id,
                },
                include: {
                    likes: true,
                    comments: true,
                },
            });

            if (!observation) throw new GraphQLError("Cette observation n'existe pas");

            if (!observation.public) {
                if (userId !== userFromContext.id)
                    throw new GraphQLError(
                        "Cette observation est privée et vous n'en êtes pas le propriétaire",
                    );
            }

            return observation;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => Observation)
    async createObservation(
        @Arg("data") data: CreateObservationInput,
        @Ctx() ctx: IContext,
        @Arg("userId") userId: string,
    ): Promise<PrismaObservation> {
        try {
            const userFromContext = authenticationCheck(ctx);

            if (data.helpCenter && !data.public) {
                throw new GraphQLError(
                    "Votre observation doit être publique si vous souhaitez la publier sur le Help Center",
                );
            }

            if (userId !== userFromContext.id)
                throw new GraphQLError(
                    "Accès refusé: vous n'êtes pas le propriétaire de cette plante",
                );

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
