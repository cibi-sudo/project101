import { z } from "zod";

export const userSignupSchema = z.object({
    name: z
        .string()
        .min(4, { message: "Username must be at least 4 characters long" })
        .optional(),
    email: z.string().email({ message: "Please provide a valid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(16, { message: "Password cannot exceed 16 characters" }),
});

export type UserSignupInput = z.infer<typeof userSignupSchema>;

