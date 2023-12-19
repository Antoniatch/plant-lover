import { Field, ObjectType } from "type-graphql";
import { Plant } from "./Plant";

@ObjectType()
export class Family {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => [Plant])
    plants: Plant[];
}
