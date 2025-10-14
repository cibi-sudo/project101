import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(payload: { id: string; email: string }) {
    return jwt.sign(
        payload,
        JWT_SECRET,
        {expiresIn: "7d"}
    );
}

export function verifyToken(token: string): { valid: boolean; payload?: any; error?: string } {
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return {valid: true, payload};
    } catch (err) {
        return {valid: false, error: "Invalid token"};
    }
}