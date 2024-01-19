import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Comment {
    @Field()
    id: string;

    @Field()
    text: string;

    @Field(() => Date)
    date: Date;

    @Field()
    likes: number;

    @Field()
    authorId: string;

    @Field({ nullable: true })
    observationId?: string;

    @Field({ nullable: true })
    userPlantId?: string;

    @Field({ nullable: true })
    plantId?: string;
}
