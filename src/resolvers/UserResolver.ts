import { Arg, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";

@Resolver(User)
export class UserResolver {
    @Query(() => User)
    async getOneUser(@Arg("id") id: string): Promise<User> {
        const userId = id;
        const user = {
            id: userId,
            name: "Antonia Tchakounte",
            password: "password",
            userPlants: [],
        };

        return user;
    }
}
