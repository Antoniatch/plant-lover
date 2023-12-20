import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Size {
    @Field()
    id: string;

    @Field()
    trackingSheetId: string;

    @Field(() => Date)
    date: string;

    @Field()
    size: number;
}
