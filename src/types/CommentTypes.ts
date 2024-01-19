import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCommentInput {
    @Field()
    text: string;

    @Field({ nullable: true })
    observationId?: string;

    @Field({ nullable: true })
    userPlantId?: string;

    @Field({ nullable: true })
    plantId?: string;
}
