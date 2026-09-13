import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}
// jwt.sign(payload, secret, options) creates a new JWT token. The payload is the data we want to include in the token, the secret is used to sign the token, and options can include things like expiration time.
export function generateToken(
    user: AuthenticatedUser
): string {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN,
        }
    );
}