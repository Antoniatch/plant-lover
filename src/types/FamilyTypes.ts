import { Field, InputType } from "type-graphql";

@InputType()
export class CreateFamilyInput {
    @Field()
    name: string;
}
