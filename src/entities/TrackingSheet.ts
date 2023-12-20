import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class TrackingSheet {
    @Field()
    id: string;

    @Field()
    userPlantId: string;

    @Field(() => Date)
    watering: string;

    @Field(() => Date)
    repotting: string;

    @Field(() => Date)
    pruning: string;
}
