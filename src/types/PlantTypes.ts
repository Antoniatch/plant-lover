import { Field, InputType } from "type-graphql";
import { Category, Environment, Exposure } from "../enums";

@InputType()
export class CreatePlantInput {
    @Field()
    image: string;

    @Field()
    name: string;

    @Field(() => Category)
    category: Category;

    @Field()
    watering: number;

    @Field(() => [Exposure])
    exposure: Exposure[];

    @Field()
    repotting: number;

    @Field()
    minTemperature: number;

    @Field()
    maxTemperature: number;

    @Field(() => Environment)
    environment: Environment;
}

@InputType()
export class idInput {
    @Field()
    id: string;
}
