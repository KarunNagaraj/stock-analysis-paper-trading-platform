import pool from "../../database/db";
import { User } from "./auth.types";

export async function createUser(
    email: string,
    passwordHash: string
): Promise<number> {
    const [result] = await pool.execute(
        `
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
        `,
        [email, passwordHash]
    );

    const insertResult = result as { insertId: number };//We're saying that this object has a property:insertId: number So TypeScript understands: insertResult.insertId is a number.

    return insertResult.insertId;
}
//This will be used during login.
export async function findUserByEmail(
    email: string
): Promise<User | null> {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            email,
            password_hash,
            created_at,
            updated_at
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    const users = rows as User[];

    return users.length > 0 ? users[0] : null;
}
//This will primarily support authenticated requests.
export async function findUserById(
    id: number
): Promise<User | null> {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            email,
            password_hash,
            created_at,
            updated_at
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    const users = rows as User[];

    return users.length > 0 ? users[0] : null;
}