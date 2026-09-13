import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}

interface JwtPayload {
    userId: number;
    email: string;
}

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.status(401).json({
            message: "Authentication required",
        });
        return;
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        res.status(401).json({
            message: "Invalid authorization header",
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as JwtPayload;

        const authenticatedUser: AuthenticatedUser = {
            id: decoded.userId,
            email: decoded.email,
        };

        req.user = authenticatedUser;

        next();
    } catch {
        res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}