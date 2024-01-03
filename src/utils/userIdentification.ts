import { GraphQLError } from "graphql";
import { prisma } from "../server";
import * as bcrypt from "bcrypt";
import type { User as PrismaUser } from "@prisma/client";

export const userIdentification = async (password: string, id?: string, name?: string): Promise<PrismaUser> => {
    if (!id && !name) throw new GraphQLError("Please provide user id or name");

    try {
        const whereOptions = id ? { id } : { name };
        const userFromDB = await prisma.user.findUnique({
            where: whereOptions,
            include: {
                userPlants: true,
            },
        });

        if (!userFromDB) throw new GraphQLError("User not found");

        const passwordIsCorrect = await bcrypt.compare(password, userFromDB.password);
        if (!passwordIsCorrect) throw new GraphQLError("Wrong password");

        return userFromDB;
    } catch (error) {
        throw new GraphQLError(`IDENTIFICATION_ERROR ${error}`);
    }
};
