import { prisma } from "../server";

// interface isUniqueArguments {
//     propertyName: string,
//     propertyValue: any
// }

const isUnique = async (name: string): Promise<boolean> => {
    let userIsUnique: boolean = true;
    const sameUserName = await prisma.user.findUnique({
        where: {
            name,
        },
    });

    if (sameUserName !== null) userIsUnique = false;
    return userIsUnique;
};

export default isUnique;
