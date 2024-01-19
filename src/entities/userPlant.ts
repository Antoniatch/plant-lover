import { Field, ObjectType } from "type-graphql";
import { Category, Environment, Exposure } from "../enums";

import { Observation } from "./Observation";
import { Comment } from "./Comment";
import { TrackingSheet } from "./TrackingSheet";
import { Like } from "./Like";

@ObjectType()
export class UserPlant {
    @Field()
    id: string;

    @Field(() => Category)
    category: Category;

    @Field({ nullable: true })
    plantId?: string;

    @Field()
    userId: string;

    @Field({ nullable: true })
    mixId?: string;

    @Field({ nullable: true })
    image?: string;

    @Field({ nullable: true })
    nickname?: string;

    @Field(() => Date, { nullable: true })
    birthday?: Date;

    @Field({ nullable: true })
    watering?: number;

    @Field(() => Exposure, { nullable: true })
    exposure?: Exposure;

    @Field({ nullable: true })
    repotting?: number;

    @Field(() => Environment, { nullable: true })
    environment?: Environment;

    @Field(() => [Observation])
    observations: Observation[];

    @Field(() => [Comment])
    comments: Comment[];

    @Field(() => TrackingSheet, { nullable: true })
    trackingSheet?: TrackingSheet;

    @Field(() => [Like])
    likes: Like[];
}
