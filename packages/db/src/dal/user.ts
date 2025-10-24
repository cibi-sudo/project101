import {prisma} from "../client.js";
import {UserSignupInput} from "@repo/validation";


export const userDAL = {
    async createUser (data: UserSignupInput) {
        return prisma.user.create({ data });
    },

    async findByEmail (data: Pick<UserSignupInput, "email">) {
        return prisma.user.findUnique(
        { where: { email: data.email } },
        );
    },

    async updateUser(id: string, data: Partial<UserSignupInput>) {
        return prisma.user.update({
            where: { id },
            data,
        });
    },

    async deleteUser(id: string) {
        return prisma.user.delete({
            where: { id },
        });
    },
}

