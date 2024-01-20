import { GraphQLError } from "graphql";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import jwt from "jsonwebtoken";

import { prisma } from "../server";

import type { User as PrismaUser } from "@prisma/client";
import { User } from "../entities/User";
import {
    LoginInput,
    UserLoginResponse,
    UserCredentials,
    UserWithoutPassword,
    CreateUserInput,
} from "../types/UserTypes";
import { IContext } from "../types/interfaces";

import { getHashedPassword } from "../utils/getHashedPassword";
import { userIdentification } from "../utils/userIdentification";
import { catchPrismaError } from "../utils/catchPrismaError";

@Resolver(User)
export class UserResolver {
    @Query(() => [User])
    async getAllUsers(): Promise<PrismaUser[]> {
        try {
            const allUsers = await prisma.user.findMany({
                include: {
                    userPlants: true,
                    observations: true,
                    comments: true,
                    trackingSheet: true,
                    receivedLikes: true,
                    authorLikes: true,
                },
            });

            return allUsers;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => UserWithoutPassword)
    async getOneUser(
        @Arg("id", { nullable: true }) id?: string,
        @Arg("name", { nullable: true }) name?: string,
        @Arg("email", { nullable: true }) email?: string,
    ): Promise<PrismaUser> {
        try {
            if (!id && !name && !email)
                throw new GraphQLError("Merci de renseigner un id, nom ou email");

            const whereOptions = id ? { id } : name ? { name } : { email };

            const uniqueUser = await prisma.user.findUnique({
                where: whereOptions,
                include: {
                    userPlants: true,
                    observations: true,
                    comments: true,
                    trackingSheet: true,
                    receivedLikes: true,
                    authorLikes: true,
                },
            });

            if (!uniqueUser) throw new GraphQLError("Cet utilisateur n'existe pas");

            delete uniqueUser.password;
            return uniqueUser;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Query(() => UserCredentials)
    async getOneUserCredentials(
        @Arg("password") password: string,
        @Ctx() ctx: IContext,
    ): Promise<PrismaUser> {
        try {
            if (!ctx.user) throw new GraphQLError("Utilisateur non authentifié");

            const userFromContext = ctx.user;
            const userFromDB = await userIdentification(password, userFromContext.id);

            return userFromDB;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => User)
    async createOneUser(@Arg("data") data: CreateUserInput): Promise<PrismaUser> {
        try {
            const { email, name, password, birthday } = data;

            const hashedPassword = await getHashedPassword(password);
            const newUser = await prisma.user.create({
                data: {
                    email,
                    name,
                    birthday,
                    password: hashedPassword,
                },
                include: {
                    userPlants: true,
                    observations: true,
                    comments: true,
                    trackingSheet: true,
                    receivedLikes: true,
                    authorLikes: true,
                },
            });

            return newUser;
        } catch (error) {
            catchPrismaError(error);
        }
    }

    @Mutation(() => UserLoginResponse)
    async login(@Arg("data") data: LoginInput): Promise<UserLoginResponse> {
        try {
            const { email, password } = data;
            const userFromDB = await userIdentification(password, null, null, email);

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
            catchPrismaError(error);
        }
    }
}
