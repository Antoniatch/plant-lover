import { GraphQLError } from "graphql";

export const catchPrismaError = (error): void => {
    const errorMessage: string | undefined = error.message ?? undefined;

    const clientVersion = error.clientVersion ?? error.extensions?.clientVersion ?? undefined;
    const code = error.code ?? error.errorCode ?? error.extensions?.code ?? "UNKNOWN";
    const target = error.meta?.target[0] ?? error.extensions?.target ?? undefined;

    if (clientVersion) {
        if (code === "P2002" && target === "email")
            throw new GraphQLError("Un utilisateur existe déjà avec cet e-mail", {
                extensions: {
                    code,
                    target,
                    clientVersion,
                },
            });

        if (code === "P2002" && target === "name")
            throw new GraphQLError("Un utilisateur existe déjà avec ce nom", {
                extensions: {
                    code,
                    target,
                    clientVersion,
                },
            });

        throw new GraphQLError(`PRISMA ERROR CODE ${code}`, {
            extensions: {
                code,
                target,
                clientVersion,
            },
        });
    }

    throw new GraphQLError(errorMessage);
};
