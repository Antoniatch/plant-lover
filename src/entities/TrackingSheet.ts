import { Field, ObjectType } from "type-graphql";
import { Size } from "./Size";

@ObjectType()
export class TrackingSheet {
    @Field()
    id: string;

    @Field()
    userPlantId: string;

    @Field(() => [Size])
    sizes: Size[];

    @Field(() => [Date])
    watering: string[];

    @Field(() => [Date])
    repotting: string[];

    @Field(() => [Date])
    pruning: string[];
}
