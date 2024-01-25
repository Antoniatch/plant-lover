import "reflect-metadata";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class TestResolver {
    @Query(() => Boolean)
    async testQuery(): Promise<boolean> {
        return true;
    }
}
