import { z } from "zod";

export const userSigninSchema = z.object({
    email: z.string().email({ message: "Please provide a valid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(16, { message: "Password cannot exceed 16 characters" }),
});

export type UserSigninInput = z.infer<typeof userSigninSchema>;
