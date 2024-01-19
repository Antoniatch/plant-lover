import { Field, InputType } from "type-graphql";
import { Category, Environment, Exposure } from "../enums";

@InputType()
export class CreateUserPlantInput {
    @Field()
    userId: string;

    @Field(() => Category)
    category: Category;

    @Field({ nullable: true })
    plantId?: string;

    @Field()
    mixId: string;

    @Field({ nullable: true })
    image?: string;

    @Field({ nullable: true })
    nickname?: string;

    @Field(() => Date, { nullable: true })
    birthday?: string;

    @Field({ nullable: true })
    watering?: number;

    @Field(() => Exposure, { nullable: true })
    exposure?: Exposure;

    @Field({ nullable: true })
    repotting?: number;

    @Field(() => Environment, { nullable: true })
    environment?: Environment;
}
