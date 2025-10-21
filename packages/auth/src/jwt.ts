import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

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
