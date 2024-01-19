import { Field, ObjectType } from "type-graphql";
import { Substrate } from "../enums";

@ObjectType()
export class Mix {
    @Field()
    id: string;

    @Field(() => [Substrate])
    substrates: Substrate[];
}
