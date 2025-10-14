import bcrypt from "bcrypt";

const SALT_ROUNDS  = Number(process.env.SALT_ROUNDS || 10);


export async function hashPassword(password: string) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}
