import * as bcrypt from "bcrypt";

export const getHashedPassword = async (password: string): Promise<string> => {
    try {
        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        return hashedPassword;
    } catch (error) {
        console.log("BCRYPT ERROR", error);
        throw new Error("Password hashing went wrong");
    }
};
