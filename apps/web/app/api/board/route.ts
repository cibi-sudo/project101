import {boardDAL} from "@repo/db";
import { createBoardSchema } from "@repo/validation";
import {NextResponse} from "next/server";
import {authMiddleware} from "@repo/auth";


export async function POST(req:Request){
    try{
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        const payload = await authMiddleware(authHeader);

       const body = await req.json();
       const validated = createBoardSchema.safeParse(body);
       if (!validated.success){
           return NextResponse.json({ error: "Validation failed" }, { status: 400 });
       }

       const {title} = validated.data;

        const board = await boardDAL.findByTitle(authHeader,title);
        if (board) {
            return NextResponse.json({ error: "Board already created try join" }, { status: 401 });
        }

        const newBoard = await boardDAL.createBoard(authHeader,payload.id, title)

        return NextResponse.json(
            {
                message: "Creating board successful",
                Board: { id: newBoard.id, name : newBoard.title},
            },
            { status: 201 }
        );

    }catch (error) {
        console.error("Creating board error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

