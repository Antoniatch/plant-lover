import { Field, ObjectType } from "type-graphql";

import { UserPlant } from "./userPlant";

@ObjectType()
export class User {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    password: string;

    @Field(() => [UserPlant])
    userPlants: UserPlant[];
}
