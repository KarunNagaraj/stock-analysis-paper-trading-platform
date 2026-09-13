import { RegisterInput, LoginInput } from "./auth.types";

export function validateRegisterInput(
    input: RegisterInput
): void {
    if (!input.email || !input.password) {
        throw new Error("Email and password are required");
    }

    if (!input.email.includes("@")) {
        throw new Error("Invalid email address");
    }

    if (input.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }
}

export function validateLoginInput(
    input: LoginInput
): void {
    if (!input.email || !input.password) {
        throw new Error("Email and password are required");
    }
}