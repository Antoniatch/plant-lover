import { GraphQLError } from "graphql";
import { prisma } from "../server";
import * as bcrypt from "bcrypt";
import type { User as PrismaUser } from "@prisma/client";

export const userIdentification = async (
    password: string,
    id?: string,
    name?: string,
    email?: string,
): Promise<PrismaUser> => {
    if (!id && !name && !email) throw new GraphQLError("Veuillez renseigner un id, nom ou e-mail");

    try {
        const whereOptions = id ? { id } : name ? { name } : { email };

        const userFromDB = await prisma.user.findUnique({
            where: whereOptions,
            include: {
                userPlants: true,
                observations: true,
                comments: true,
                trackingSheet: true,
                receivedLikes: true,
                authorLikes: true,
            },
        });

        if (!userFromDB) throw new GraphQLError("Cet utilisateur n'existe pas");

        const passwordIsCorrect = await bcrypt.compare(password, userFromDB.password);
        if (!passwordIsCorrect) throw new GraphQLError("Mot de passe incorrect");

        return userFromDB;
    } catch (error) {
        const errorMessage: string = error.message ?? undefined;
        const clientVersion: string = error.clientVersion ?? undefined;
        const errorCode: string = error.code ?? error.errorCode ?? undefined;
        const target: string = error.meta?.target[0] ?? undefined;

        throw new GraphQLError(errorMessage, {
            extensions: {
                clientVersion,
                code: errorCode,
                target,
            },
        });
    }
};
