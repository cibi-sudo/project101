import { userDAL } from "@repo/db";
import { hashPassword } from "@repo/auth";
import { userSignupSchema } from "@repo/validation";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validateData = userSignupSchema.safeParse(body);
        if (!validateData.success) {
            return new Response(JSON.stringify({ error: "Validation error" }), { status: 400 });
        }

        const { email, password, name } = validateData.data;

        const existingUser = await userDAL.findByEmail({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await userDAL.createUser({ email, password: hashedPassword, name });

        return new Response(
            JSON.stringify({ user: { id: newUser.id, email: newUser.email } }),
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
