import { Request, Response } from "express";
import {
    authenticateUser,
    registerUser,
    getUserById,
} from "./auth.service";
import {
    LoginInput,
    RegisterInput,
} from "./auth.types";
import { generateToken } from "./auth.token";

export async function register(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const input: RegisterInput = req.body;

        const user = await registerUser(input);

        res.status(201).json({
            user,
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Registration failed";

        res.status(400).json({
            message,
        });
    }
}

export async function login(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const input: LoginInput = req.body;

        const user = await authenticateUser(input);
        const token = generateToken(user);

        res.status(200).json({
            user,
            token,
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Login failed";

        res.status(401).json({
            message,
        });
    }
}

export async function me(
    req: Request,
    res: Response
): Promise<void> {
    if (!req.user) {
        res.status(401).json({
            message: "Authentication required",
        });
        return;
    }

    try {
        const user = await getUserById(req.user.id);

        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            user,
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to retrieve user";

        res.status(500).json({
            message,
        });
    }
}
/*The purpose of /api/auth/me is to let the frontend ask the backend, "Who am I currently authenticated as?"
The frontend sends the JWT, the middleware verifies it and extracts the user ID, and /me uses that ID to retrieve the user's current information from the database. 
This is particularly useful when the application starts or refreshes: 
the frontend can send its token to /me and determine whether the user is still authenticated and which account they're logged into. It also avoids making the frontend treat the information stored in the JWT as the complete source of truth.*/
/*                 LOGIN
                   │
                   ▼
          auth.controller.ts
                   │
                   ▼
          authenticateUser()
                   │
             bcrypt.compare()
                   │
                   ▼
          AuthenticatedUser
          { id: 1, email: ... }
                   │
                   ▼
             generateToken()
                   │
                   ▼
                 JWT
                   │
                   ▼
             HTTP response*/