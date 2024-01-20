import { type idInput } from "../types/PlantTypes";

interface IConnectMethod {
    connect: idInput;
}

interface IReturn {
    author: IConnectMethod;
    [field: string]: IConnectMethod;
}

export const connectToUniqueField = (authorId: string, field: string, fieldId: string): IReturn => {
    return {
        author: {
            connect: { id: authorId },
        },
        [field]: {
            connect: { id: fieldId },
        },
    };
};
