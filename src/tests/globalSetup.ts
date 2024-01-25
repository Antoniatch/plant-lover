import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { TestResolver } from "./TestResolver";

const startTestServer = async (
    port: number,
): Promise<{ apolloServer: ApolloServer; url: string }> => {
    try {
        const testSchema = await buildSchema({
            resolvers: [TestResolver],
        });

        const apolloServer = new ApolloServer({
            schema: testSchema,
        });

        const { url } = await startStandaloneServer(apolloServer, {
            listen: {
                port,
            },
        });

        return {
            apolloServer,
            url,
        };
    } catch (error) {
        console.log(error);
    }
};

module.exports = async function (): Promise<void> {
    const port = 4001;
    const { apolloServer, url } = await startTestServer(port);

    globalThis.testServer = apolloServer;
    globalThis.url = url;
    globalThis.port = port;
};
