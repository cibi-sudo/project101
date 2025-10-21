import {prisma} from "../client.js";
import {UserSignupInput} from "@repo/validation";
import {authMiddleware} from "@repo/auth";

export const userDAL = {
    async createUser (data: UserSignupInput) {
        return prisma.user.create({ data });
    },

    async findByEmail (data: Pick<UserSignupInput, "email">) {
        return prisma.user.findUnique(
        { where: { email: data.email } },
        );
    },

    async updateUser(token: string, id: string, data: Partial<UserSignupInput>) {
        const payload = await authMiddleware(token);
        if (payload.id !== id) throw new Error("Unauthorized");

        return prisma.user.update({
            where: { id },
            data,
        });
    },

    async deleteUser(token: string, id: string) {
        const payload = await authMiddleware(token);
        if (payload.id !== id) throw new Error("Unauthorized");

        return prisma.user.delete({
            where: { id },
        });
    },
}

