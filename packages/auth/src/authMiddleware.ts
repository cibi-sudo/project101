import { verifyToken } from "./jwt";

export async function authMiddleware(token?: string) {
    if (!token) throw new Error("Authentication token missing");

    const { valid, payload } = verifyToken(token);
    if (!valid || !payload) throw new Error("Invalid or expired token");

    return payload;
}
