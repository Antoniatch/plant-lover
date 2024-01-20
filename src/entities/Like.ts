import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Like {
    @Field()
    id: string;

    @Field(() => Date)
    date: Date;

    @Field()
    authorId: string;

    @Field({ nullable: true })
    userId: string;

    @Field({ nullable: true })
    userPlantId?: string;

    @Field({ nullable: true })
    plantId?: string;

    @Field({ nullable: true })
    commentId?: string;
}
