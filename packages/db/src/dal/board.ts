import {prisma} from "../client.js";

export const boardDAL = {
    async createBoard(ownerId: string, title: string) {
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

    async findByTitle(ownerId: string,title: string) {
        return  await prisma.board.findFirst({
            where: {
                title,
                ownerId,
            },
            select: {
                title: true,
            },
        });
    }

};
