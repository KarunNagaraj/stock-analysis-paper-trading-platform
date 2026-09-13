import api from "./api";
import type {
    LoginInput,
    RegisterInput,
    LoginResponse,
    RegisterResponse,
    User,
} from "../types/auth";

export async function register(
    input: RegisterInput
): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(
        "/auth/register",
        input
    );

    return response.data;
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