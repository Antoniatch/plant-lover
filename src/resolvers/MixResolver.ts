import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Mix } from "../entities/Mix";
import type { Mix as PrismaMix } from "@prisma/client";
import { prisma } from "../server";
import { Substrate } from "../enums";
import { catchPrismaError } from "../utils/catchPrismaError";

@Resolver()
export class MixResolver {
    @Query(() => [Mix])
    async getAllMixes(): Promise<PrismaMix[]> {
        try {
            const mixes = await prisma.mix.findMany();
            return mixes;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => Mix)
    async getOneMix(@Arg("id") id: string): Promise<PrismaMix> {
        try {
            const mix = await prisma.mix.findUnique({
                where: {
                    id,
                },
            });

            return mix;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => Mix)
    async findOrCreateMix(
        @Arg("substrates", () => [Substrate]) substrates: Substrate[],
    ): Promise<PrismaMix> {
        try {
            const newMixLength = substrates.length;

            const availableMixes = await prisma.mix.findMany();

            const getMatchingMix = (): string | false => {
                const sameLengthMixes = availableMixes.filter((mix) => {
                    return mix.substrates.length === newMixLength;
                });

                if (!sameLengthMixes.length) {
                    return false;
                }

                let matchingMix: string | false = false;
                for (const mix of sameLengthMixes) {
                    let matchingSubstrates = 0;
                    mix.substrates.forEach((mixSubstrate) => {
                        for (const newSubstrate of substrates) {
                            if (mixSubstrate === newSubstrate) {
                                matchingSubstrates++;
                                break;
                            }
                        }
                    });
                    if (matchingSubstrates === newMixLength) {
                        matchingMix = mix.id;
                        break;
                    }
                }

                return matchingMix;
            };

            const matchingMix = getMatchingMix();
            let returnedMix: PrismaMix;

            if (!matchingMix) {
                returnedMix = await prisma.mix.create({
                    data: {
                        substrates,
                    },
                });
            } else {
                returnedMix = await prisma.mix.findUnique({
                    where: {
                        id: matchingMix,
                    },
                });
            }

            return returnedMix;
        } catch (error) {
            catchPrismaError(error);
        }
    }
}
