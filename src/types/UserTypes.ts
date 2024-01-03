import { Field, InputType, ObjectType } from "type-graphql";
import type { User } from "../entities/User";
import { UserPlant } from "../entities/userPlant";

@InputType()
export class LoginInput implements Partial<User> {
    @Field()
    name: string;

    @Field()
    password: string;
}

@ObjectType()
export class UserLoginResponse {
    @Field()
    id: string

    @Field()
    name: string
    
    @Field()
    accessToken: string
}

@ObjectType()
export class UserWithoutPassword implements Partial<User> {
    @Field()
    id: string

    @Field()
    name: string

    @Field(() => [UserPlant], {nullable: true})
    userPlants?: UserPlant[];
}

@ObjectType()
export class UserCredentials implements Partial <User> {
    @Field()
    id: string

    @Field()
    name?: string;

    @Field()
    password?: string;
}