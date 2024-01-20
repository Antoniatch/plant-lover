import { Field, InputType } from "type-graphql";

@InputType()
export class CreateLikeInput {
    @Field({ nullable: true })
    userId?: string;

    @Field({ nullable: true })
    userPlantId?: string;

    @Field({ nullable: true })
    plantId?: string;

    @Field({ nullable: true })
    observationId?: string;

    @Field({ nullable: true })
    commentId?: string;
}
