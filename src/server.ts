import "reflect-metadata";

import { PrismaClient } from "@prisma/client";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import { GraphQLError } from "graphql";

import express from "express";
import cors from "cors";
import http from "http";

import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import { UserResolver } from "./resolvers/UserResolver";
import { UserPlantResolver } from "./resolvers/UserPlantResolver";

import type { IContext } from "./types/interfaces";
import { MixResolver } from "./resolvers/MixResolver";
import { PlantResolver } from "./resolvers/PlantResolver";
import { FamilyResolver } from "./resolvers/FamilyResolver";
import { ObservationResolver } from "./resolvers/ObservationResolver";
import { TrackingSheetResolver } from "./resolvers/TrackingSheetResolver";
import { CommentResolver } from "./resolvers/CommentResolver";
import { SizeResolver } from "./resolvers/SizeResolver";
import { LikeResolver } from "./resolvers/LikeResolver";

const app = express();
const httpServer = http.createServer(app);

export const prisma = new PrismaClient();

const getUserFromToken = (token: string): string | JwtPayload => {
    try {
        if (token) {
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return user;
        }
        return null;
    } catch (error) {
        const message: string = error;
        throw new GraphQLError(message);
    }
};

const startServer = async (): Promise<void> => {
    try {
        const schema = await buildSchema({
            resolvers: [
                UserResolver,
                UserPlantResolver,
                MixResolver,
                PlantResolver,
                FamilyResolver,
                ObservationResolver,
                TrackingSheetResolver,
                CommentResolver,
                SizeResolver,
                LikeResolver,
            ],
        });

        const server = new ApolloServer<IContext>({
            schema,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });

        await server.start();

        app.use(
            "/",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cors({ origin: process.env.ORIGIN, credentials: true }),
            express.json(),
            expressMiddleware(server, {
                context: async ({ req }) => {
                    if (process.env.ACCESS_TOKEN_SECRET === undefined)
                        throw new GraphQLError("Pas de clé secrète JWT fournie");

                    if (req.headers.authorization === undefined) {
                        return {};
                    }

                    const token = req.headers.authorization;
                    const user = token && getUserFromToken(token);
                    return { user };
                },
            }),
        );

        await new Promise<void>((resolve) =>
            httpServer.listen({ port: process.env.PORT }, resolve),
        );

        console.log(`🚀  Server ready at http://${process.env.HOST}:${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
};

void startServer();
