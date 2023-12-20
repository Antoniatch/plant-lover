import { Field, ObjectType } from "type-graphql";
import { Substrate } from "@prisma/client";

@ObjectType()
export class Mix {
    @Field()
    id: string;

    @Field(() => [Substrate])
    substrates: Substrate[];
}
