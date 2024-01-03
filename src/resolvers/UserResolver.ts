import { GraphQLError } from "graphql";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import jwt from "jsonwebtoken";

import { prisma } from "../server";

import type { User as PrismaUser } from "@prisma/client";
import { User } from "../entities/User";
import { LoginInput, UserLoginResponse, UserCredentials, UserWithoutPassword } from "../types/UserTypes";
import { IContext } from "../types/interfaces";

import isUnique from "../utils/isUnique";
import { getHashedPassword } from "../utils/getHashedPassword";
import { userIdentification } from "../utils/userIdentification";

@Resolver(User)
export class UserResolver {
    @Query(() => [User])
    async getAllUsers(): Promise<PrismaUser[]> {
        try {
            const allUsers = await prisma.user.findMany({
                include: {
                    userPlants: true,
                },
            });

            return allUsers;
        } catch (error) {
            throw new GraphQLError(error);
        }
    }

    @Query(() => UserWithoutPassword)
    async getOneUser(@Arg("id", { nullable: true }) id?: string, @Arg("name", { nullable: true }) name?: string): Promise<PrismaUser> {
        try {
            if (!id && !name) throw new GraphQLError("Please provide user id or name");

            const whereOptions = id ? { id } : { name };

            const uniqueUser = await prisma.user.findUnique({
                where: whereOptions,
                include: {
                    userPlants: true,
                },
            });

            if (!uniqueUser) throw new GraphQLError("No user found");

            delete uniqueUser.password;
            return uniqueUser;
        } catch (error) {
            return error;
        }
    }

    @Query(() => UserCredentials)
    async getOneUserCredentials(@Arg("password") password: string, @Ctx() ctx: IContext): Promise<PrismaUser> {
        try {
            if (!ctx.user)
                throw new GraphQLError("User is not authenticated", {
                    extensions: {
                        code: "UNAUTHENTICATED",
                        http: {
                            status: 401,
                        },
                    },
                });

            const userFromContext = ctx.user;
            const userFromDB = await userIdentification(password, userFromContext.id);

            return userFromDB;
        } catch (error) {
            return error;
        }
    }

    @Mutation(() => User)
    async createOneUser(@Arg("data") data: LoginInput): Promise<PrismaUser> {
        try {
            const { name, password } = data;

            const userIsUnique = await isUnique(name);
            if (!userIsUnique) throw new Error("User name already exists");

            const hashedPassword = await getHashedPassword(password);
            const newUser = await prisma.user.create({
                data: {
                    name,
                    password: hashedPassword,
                },
                include: {
                    userPlants: true,
                },
            });

            return newUser;
        } catch (error) {
            return error;
        }
    }

    @Mutation(() => UserLoginResponse)
    async login(@Arg("data") data: LoginInput): Promise<UserLoginResponse> {
        try {
            const { name, password } = data;
            const userFromDB = await userIdentification(password, null, name);

            const currentUser = {
                id: userFromDB.id,
                name: userFromDB.name,
            };

            const accessToken = jwt.sign(currentUser, process.env.ACCESS_TOKEN_SECRET);

            return {
                ...currentUser,
                accessToken,
            };
        } catch (error) {
            throw new GraphQLError(error);
        }
    }
}
