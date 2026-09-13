import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedUser } from "./auth.types";

//explicitly establish the type: that it is string and not undefined, if it is undefined throw an error
const JWT_SECRET: string = process.env.JWT_SECRET ?? (() => {
    throw new Error("JWT_SECRET is not configured");
})();



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
         const decoded = jwt.verify(token, JWT_SECRET);

         //"Reject the request if ANYTHING about the decoded payload is not what we expect."
      if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "number" ||
            typeof decoded.email !== "string"
        ) {
            res.status(401).json({
                message: "Invalid token payload",
            });
            return;
        }

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