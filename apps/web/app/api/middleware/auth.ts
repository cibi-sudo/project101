import { verifyToken, AuthPayload } from "@repo/auth";
import { NextResponse } from "next/server";

export interface AuthRequest extends Request {
    user?: AuthPayload;
}

export const withAuth = (handler: (req: AuthRequest) => Promise<NextResponse>) => {
    return async (req: AuthRequest) => {
        const token = req.headers.get("authorization") ?? "";

        if (!token) {
            return NextResponse.json({ error: "Authorization token missing" }, { status: 401 });
        }

        const { valid, payload } = verifyToken(token);

        if (!valid || !payload) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        req.user = payload;

        try {
            return await handler(req);
        } catch (err) {
            console.error("Handler error:", err);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    };
};
