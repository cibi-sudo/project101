import {prisma} from "../client.js";
import {authMiddleware} from "@repo/auth";

export const boardDAL = {
    async createBoard(token: string, ownerId: string, title: string) {
        const payload = await authMiddleware(token);
        if (payload.id !== ownerId) throw new Error("Unauthorized");

        return await prisma.board.create({
            data: {
                title,
                ownerId,
            },
            select: {
                id: true,
                title: true,
            },
        });
    },

    async findByTitle(token: string, title: string) {
        const payload = await authMiddleware(token);

        return  await prisma.board.findFirst({
            where: {
                title,
                ownerId: payload.id,
            },
        });
    }

};
