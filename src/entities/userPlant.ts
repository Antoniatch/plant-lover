import { Field, ObjectType } from "type-graphql";

import { Environment, Exposure } from "../enums";

import { Observation } from "./Observation";

@ObjectType()
export class UserPlant {
    @Field()
    id: string;

    @Field()
    plantId: string;

    @Field()
    userId: string;

    @Field()
    trackingId: string;

    @Field()
    image: string;

    @Field()
    nickname: string;

    @Field()
    watering: number;

    @Field(() => Exposure)
    exposure: Exposure;

    @Field()
    mixId: string;

    @Field()
    repotting: number;

    @Field(() => Environment)
    environment: Environment;

    @Field(() => [Observation])
    observations: Observation[];
}
