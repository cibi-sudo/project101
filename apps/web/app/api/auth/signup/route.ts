import { NextResponse } from "next/server";
import { userDAL } from "@repo/db";
import { hashPassword } from "@repo/auth";
import { userSignupSchema } from "@repo/validation";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = userSignupSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        }

        const { email, password, name } = validated.data;

        const existingUser = await userDAL.findByEmail({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await userDAL.createUser({
            email,
            password: hashedPassword,
            name,
        });

        return NextResponse.json(
            {
                message: "Signup successful try signin",
                user: { id: newUser.id, email: newUser.email, name: newUser.name },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
