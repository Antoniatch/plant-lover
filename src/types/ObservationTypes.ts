import { Field, InputType } from "type-graphql";

@InputType()
export class CreateObservationInput {
    @Field()
    description: string;

    @Field({ nullable: true })
    image?: string;

    @Field()
    helpCenter: boolean;

    @Field()
    public: boolean;

    @Field()
    userId: string;

    @Field()
    userPlantId: string;
}
