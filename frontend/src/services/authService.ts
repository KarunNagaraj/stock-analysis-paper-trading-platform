import api from "./api";
import type {
    LoginInput,
    RegisterInput,
    LoginResponse,
    User,
} from "../types/auth";

export async function register(
    input: RegisterInput
): Promise<User> {
    const response = await api.post<{ user: User }>(
        "/auth/register",
        input
    );

    return response.data.user;
}

export async function login(
    input: LoginInput
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        input
    );

    return response.data;
}

export async function getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>(
        "/auth/me"
    );

    return response.data.user;
}