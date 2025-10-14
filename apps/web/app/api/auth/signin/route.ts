import { NextApiRequest, NextApiResponse } from "next";
import { userDAL } from "@repo/db";
import { verifyPassword, generateToken } from "@repo/auth";
import { userSigninSchema } from "@repo/validation";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const validated = userSigninSchema.safeParse(req.body);

    if (!validated.success) {
        return res.status(400).json({
            error: "Validation error",
        });
    }

    const { email, password } = validated.data;

    try {
        const user = await userDAL.findByEmail({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

        const token = generateToken(user);

        res.status(200).json({
            user: { id: user.id, email: user.email },
            token,
        });
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
