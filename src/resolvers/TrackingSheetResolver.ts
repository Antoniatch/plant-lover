import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { TrackingSheet } from "../entities/TrackingSheet";
import type { TrackingSheet as PrismaTrackingSheet } from "@prisma/client";
import { prisma } from "../server";
import { catchPrismaError } from "../utils/catchPrismaError";
import { GraphQLError } from "graphql";

import { CreateTrackingSheetInput } from "../types/TrackingSheetTypes";
import { idInput } from "../types/PlantTypes";
import { IContext } from "../types/interfaces";
import { authenticationCheck } from "../utils/authenticationCheck";

@Resolver()
export class TrackingSheetResolver {
    @Query(() => [TrackingSheet])
    async getAllTrackingSheets(): Promise<PrismaTrackingSheet[]> {
        try {
            const trackingSheets = await prisma.trackingSheet.findMany({
                include: {
                    sizes: true,
                },
            });

            return trackingSheets;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => TrackingSheet)
    async getOneTrackingSheet(
        @Arg("id") id: string,
        @Ctx() ctx: IContext,
        @Arg("userId", { nullable: true }) userId?: string,
    ): Promise<PrismaTrackingSheet> {
        try {
            const userFromContext = authenticationCheck(ctx);

            const trackingSheet = await prisma.trackingSheet.findUnique({
                where: {
                    id,
                },
                include: {
                    sizes: true,
                },
            });

            if (!trackingSheet) throw new GraphQLError("Cette fiche de suivi n'existe pas");

            if (!trackingSheet.public) {
                if (!userId)
                    throw new GraphQLError("Merci de renseigner l'identifiant utilisateur");

                if (userId !== userFromContext.id)
                    throw new GraphQLError(
                        "Accès refusé: vous n'êtes pas le propriétaire de cette fiche de suivi",
                    );
            }

            return trackingSheet;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => TrackingSheet)
    async createTrackingSheet(
        @Arg("data") data: CreateTrackingSheetInput,
        @Arg("userId") userId: string,
        @Arg("userPlantId") userPlantId: string,
        @Ctx() ctx: IContext,
        @Arg("sizeId", { nullable: true }) sizeId?: idInput,
    ): Promise<CreateTrackingSheetInput> {
        try {
            const userFromContext = authenticationCheck(ctx);

            if (userFromContext.id !== userId) {
                throw new GraphQLError(
                    "Accès refusé: vous n'êtes pas le propriétaire de cette plante",
                );
            }

            const newTrackingSheet = await prisma.trackingSheet.create({
                data: {
                    ...data,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                    userPlant: {
                        connect: {
                            id: userPlantId,
                        },
                    },
                    sizes: {
                        connect: sizeId,
                    },
                },
                include: {
                    sizes: true,
                },
            });

            return newTrackingSheet;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
