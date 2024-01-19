import { Field, ObjectType } from "type-graphql";

import { Category, Environment, Exposure } from "../enums";

import { Mix } from "./Mix";
import { UserPlant } from "./userPlant";
import { Comment } from "./Comment";

@ObjectType()
export class Plant {
    @Field()
    id: string;

    @Field()
    image: string;

    @Field()
    name: string;

    @Field()
    familyId: string;

    @Field(() => Category)
    category: Category;

    @Field()
    watering: number;

    @Field(() => [Exposure])
    exposure: Exposure[];

    @Field(() => [Mix])
    mixes: Mix[];

    @Field()
    repotting: number;

    @Field()
    minTemperature: number;

    @Field()
    maxTemperature: number;

    @Field(() => Environment)
    environment: Environment;

    @Field(() => [UserPlant])
    userPlants: UserPlant[];

    @Field(() => [Comment])
    comments: Comment[];
}
