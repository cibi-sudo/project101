import { NextApiRequest, NextApiResponse } from "next";
import { userDAL } from "@repo/db";
import {hashPassword} from "@repo/auth";
import {userSignupSchema} from "@repo/validation";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const validateData = userSignupSchema.safeParse(req.body);

    if (!validateData.success) {
        return res.status(400).json({ error: "Validation error"});
    }

    const { email, password,username } = validateData.data;

    try {
        const existingUser = await userDAL.findByEmail({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await hashPassword(password);

        const newUser = await userDAL.createUser({ email, password: hashedPassword,username });

        res.status(201).json({ user: { id: newUser.id, email: newUser.email }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

