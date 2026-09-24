import jwt, { type SignOptions } from "jsonwebtoken";
import { AuthenticatedUser } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}

const jwtSecret: string = JWT_SECRET;
const jwtOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
};

// jwt.sign(payload, secret, options) creates a new JWT token. The payload is the data we want to include in the token, the secret is used to sign the token, and options can include things like expiration time.
export function generateToken(
    user: AuthenticatedUser
): string {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        jwtSecret,
        jwtOptions
    );
}