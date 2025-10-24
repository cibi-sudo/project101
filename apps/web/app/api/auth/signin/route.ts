import { NextResponse } from "next/server";
import { userDAL } from "@repo/db";
import { verifyPassword, generateToken } from "@repo/auth";
import { userSigninSchema } from "@repo/validation";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = userSigninSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        }
        const { email, password } = validated.data;

        const user = await userDAL.findByEmail({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const token = generateToken({ id: user.id, email: user.email });

        return NextResponse.json(
            { message: "Signin successful", user: { id: user.id, email: user.email }, token },
            { status: 200 }
        );

    } catch (error) {
        console.error("Signin error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
