import { registerEnumType } from "type-graphql";

export enum Exposure {
    DIRECT = "DIRECT",
    INDIRECT = "INDIRECT",
    MI = "MI",
    OMBRE = "OMBRE",
}

registerEnumType(Exposure, {
    name: "Exposure",
});

export enum Substrate {
    TERREAU = "TERREAU",
    TERRE = "TERRE",
    PERLITE = "PERLITE",
    CAILLOUX = "CAILLOUX",
}

registerEnumType(Substrate, {
    name: "Substrate",
});

export enum Environment {
    OUTDOOR = "OUTDOOR",
    INDOOR = "INDOOR",
}

registerEnumType(Environment, {
    name: "Environment",
});

export enum Category {
    FLEUR = "FLEUR",
    BONSAI = "BONSAI",
    BUISSON = "BUISSON",
    ARBRE = "ARBRE",
    SUCCULENTE = "SUCCULENTE",
    CACTUS = "CACTUS",
}

registerEnumType(Category, {
    name: "Category",
});
