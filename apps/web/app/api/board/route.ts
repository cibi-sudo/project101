import { boardDAL } from "@repo/db";
import { createBoardSchema } from "@repo/validation";
import { NextResponse } from "next/server";
import { withAuth, AuthRequest } from "../middleware/auth";

export const POST = withAuth(
    async (req: AuthRequest) => {
    try {
        const body = await req.json();
        const validated = createBoardSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        }

        const { title } = validated.data;
        const ownerId = req.user!.id;

        const board = await boardDAL.findByTitle(ownerId, title);

        if (board) {
            return NextResponse.json(
                { error: "Board already created, try join", board: { name: board.title } },
                { status: 401 }
            );
        }

        const newBoard = await boardDAL.createBoard(ownerId, title);

        return NextResponse.json(
            { message: "Creating board successful", board: { id: newBoard.id, name: newBoard.title } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Creating board error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
