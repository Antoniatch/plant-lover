import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PlantMix {
    @Field()
    id: string;

    @Field()
    plantId: string;

    @Field()
    mixId: string;
}
