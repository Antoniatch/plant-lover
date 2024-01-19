import { Field, InputType } from "type-graphql";

@InputType()
export class CreateSizeInput {
    @Field()
    size: number;

    @Field()
    trackingSheetId: string;
}
