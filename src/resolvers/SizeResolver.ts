import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Size } from "../entities/Size";
import type { Size as PrismaSize } from "@prisma/client";
import { prisma } from "../server";
import { CreateSizeInput } from "../types/SizeTypes";
import { catchPrismaError } from "../utils/catchPrismaError";

@Resolver()
export class SizeResolver {
    @Query(() => [Size])
    async getAllTrackingSheetSizes(
        @Arg("trackingSheetId") trackingSheetId: string,
    ): Promise<PrismaSize[]> {
        try {
            const trackingSheetSizes = await prisma.size.findMany({
                where: {
                    trackingSheetId,
                },
            });

            return trackingSheetSizes;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => Size)
    async createSize(@Arg("data") data: CreateSizeInput): Promise<PrismaSize> {
        try {
            const newSize = await prisma.size.create({
                data,
            });

            return newSize;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
