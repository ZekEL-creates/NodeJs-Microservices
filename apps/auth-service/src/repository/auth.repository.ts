import { RegisterSchema } from "../schemas/auth.schemas";
import { User } from "../types/auth.types";
import { dbPool } from "shared";

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await dbPool().query(
    `SELECT id, name, email, role, password_hash, created_at
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createUser(user: RegisterSchema): Promise<User> {
  const result = await dbPool().query<User>(
    `INSERT INTO users (name, email, password_hash) 
    VALUES ($1, $2, $3)
    RETURNING id, name, email, role, created_at`,
    [user.name, user.email, user.password],
  );

  return result.rows[0];
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await dbPool().query(
    `
    SELECT id, name, email, role, password_hash, created_at
    FROM users
    WHERE id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
}
