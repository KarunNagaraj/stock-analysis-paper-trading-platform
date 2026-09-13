export interface User {
    id: number;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export interface PublicUser {
    id: number;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface RegisterInput {
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthenticatedUser {
    id: number;
    email: string;
}


