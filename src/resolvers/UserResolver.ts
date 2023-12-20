import { Arg, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { PrismaClient } from "@prisma/client";
import type { User as PrismaUser } from "@prisma/client";
const prisma = new PrismaClient();

@Resolver(User)
export class UserResolver {
    @Query(() => [User])
    async getAllUsers(): Promise<PrismaUser[]> {
        const allUsers = await prisma.user.findMany({
            include: {
                userPlants: true,
            },
        });

        return allUsers;
    }

    @Query(() => User)
    async getOneUserById(@Arg("id") id: string): Promise<PrismaUser | null> {
        try {
            const userId = id;
            const uniqueUser = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

            if (uniqueUser === null) {
                throw new Error("No user found with this id");
            }

            return uniqueUser;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
