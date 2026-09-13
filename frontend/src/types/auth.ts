export interface User {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface RegisterInput {
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}