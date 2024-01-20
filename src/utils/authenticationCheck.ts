import { GraphQLError } from "graphql";
import type { IContext, IContextUser } from "../types/interfaces";

export const authenticationCheck = (ctx: IContext): IContextUser => {
    const userFromContext = ctx.user;
    if (!userFromContext) throw new GraphQLError("Utilisateur non authentifié");

    return userFromContext;
};
