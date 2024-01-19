import { Field, ObjectType } from "type-graphql";
import { Comment } from "./Comment";

@ObjectType()
export class Observation {
    @Field()
    id: string;

    @Field()
    userId: string;

    @Field()
    userPlantId: string;

    @Field(() => Date)
    date: Date;

    @Field()
    description: string;

    @Field({ nullable: true })
    image?: string;

    @Field()
    helpCenter: boolean;

    @Field()
    public: boolean;

    @Field(() => [Comment])
    comments: Comment[];
}
