import { Arg, Query, Resolver } from "type-graphql";
import { TrackingSheet } from "../entities/TrackingSheet";
import type { TrackingSheet as PrismaTrackingSheet } from "@prisma/client";
import { prisma } from "../server";
import { catchPrismaError } from "../utils/catchPrismaError";
import { GraphQLError } from "graphql";

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
    async getOneTrackingSheet(@Arg("id") id: string): Promise<PrismaTrackingSheet> {
        try {
            const trackingSheet = await prisma.trackingSheet.findUnique({
                where: {
                    id,
                },
            });

            if (!trackingSheet) throw new GraphQLError("Cette fiche de suivi n'existe pas");
            return trackingSheet;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
