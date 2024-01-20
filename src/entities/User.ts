import { Field, ObjectType } from "type-graphql";

import { UserPlant } from "./userPlant";
import { TrackingSheet } from "./TrackingSheet";
import { Observation } from "./Observation";
import { Comment } from "./Comment";
import { Like } from "./Like";

@ObjectType()
export class User {
    @Field()
    id: string;

    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    password: string;

    @Field(() => Date, { nullable: true })
    birthday?: Date;

    @Field(() => [TrackingSheet])
    trackingSheet: TrackingSheet[];

    @Field(() => [UserPlant])
    userPlants: UserPlant[];

    @Field(() => [Observation])
    observations: Observation[];

    @Field(() => [Comment])
    comments: Comment[];

    @Field(() => [Like])
    likes: Like[];
}
