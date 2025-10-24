import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = String(process.env.JWT_SECRET);

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing.");
}

export interface AuthPayload extends JwtPayload {
    id: string;
    email: string;
}

export function generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): {
    valid: boolean;
    payload?: AuthPayload;
    error?: string;
} {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        return { valid: true, payload: decoded };
    } catch {
        return { valid: false, error: "Invalid or expired token" };
    }
}
