import { GraphQLError } from "graphql";

export const catchPrismaError = (error): void => {
    console.log(error);
    const errorMessage: string | undefined = error.message ?? undefined;

    const clientVersion = error.clientVersion ?? error.extensions?.clientVersion ?? undefined;
    const code = error.code ?? error.errorCode ?? error.extensions?.code ?? "UNKNOWN";
    const target = error.meta?.target
        ? error.meta.target[0]
        : error.extensions?.target
          ? error.extensions.target
          : undefined;
    const modelName = error.meta?.modelName ?? error.extensions.modelName ?? undefined;
    const cause = error.meta?.cause ?? error.extensions.cause ?? undefined;

    // Si clientVersion existe, cela signifie que c'est une erreur générée par Prisma
    if (clientVersion) {
        if (code === "P2002" && target === "email")
            throw new GraphQLError("Un utilisateur existe déjà avec cet e-mail", {
                extensions: {
                    code,
                    target,
                    clientVersion,
                    modelName,
                    cause,
                },
            });

        if (code === "P2002" && target === "name")
            throw new GraphQLError("Un utilisateur existe déjà avec ce nom", {
                extensions: {
                    code,
                    target,
                    clientVersion,
                    modelName,
                    cause,
                },
            });

        throw new GraphQLError(`PRISMA ERROR CODE ${code}`, {
            extensions: {
                code,
                target,
                clientVersion,
                modelName,
                cause,
            },
        });
    }

    throw new GraphQLError(errorMessage);
};
