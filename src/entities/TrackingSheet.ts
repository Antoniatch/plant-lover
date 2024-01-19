import { Field, ObjectType } from "type-graphql";
import { Size } from "./Size";

@ObjectType()
export class TrackingSheet {
    @Field()
    id: string;

    @Field()
    userId: string;

    @Field()
    userPlantId: string;

    @Field(() => [Size])
    sizes: Size[];

    @Field(() => [Date])
    watering: Date[];

    @Field(() => [Date])
    repotting: Date[];

    @Field(() => [Date])
    pruning: Date[];
}
