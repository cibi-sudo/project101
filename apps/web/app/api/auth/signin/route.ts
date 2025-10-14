import { userDAL } from "@repo/db";
import { verifyPassword, generateToken } from "@repo/auth";
import { userSigninSchema } from "@repo/validation";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validated = userSigninSchema.safeParse(body);
        if (!validated.success) {
            return new Response(JSON.stringify({ error: "Validation error" }), { status: 400 });
        }

        const { email, password } = validated.data;

        const user = await userDAL.findByEmail({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        const token = generateToken(user);

        return new Response(
            JSON.stringify({ user: { id: user.id, email: user.email }, token }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Signin error:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
