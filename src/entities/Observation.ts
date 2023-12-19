import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Observation {
    @Field()
    id: string;

    @Field()
    userPlantId: string;

    @Field(() => Date)
    date: string;

    @Field()
    description: string;
}
