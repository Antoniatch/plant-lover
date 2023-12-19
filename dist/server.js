import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver.js";
const startServer = async () => {
    try {
        const schema = await buildSchema({
            resolvers: [UserResolver],
        });
        const server = new ApolloServer({
            schema,
        });
        const { url } = await startStandaloneServer(server, {
            listen: { port: 4000 },
        });
        console.log(`🚀  Server ready at: ${url}`);
    }
    catch (error) {
        console.log(error);
    }
};
void startServer();
//# sourceMappingURL=server.js.map