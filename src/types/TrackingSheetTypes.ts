import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTrackingSheetInput {
    @Field()
    public: boolean;

    @Field(() => [Date])
    watering: Date[];

    @Field(() => [Date])
    repotting: Date[];

    @Field(() => [Date])
    pruning: Date[];
}
