import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Size {
    @Field()
    id: string;

    @Field()
    trackingSheetId: string;

    @Field(() => Date)
    date: Date;

    @Field()
    size: number;
}
