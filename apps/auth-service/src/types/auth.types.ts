export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password_hash: string;
  created_at: Date;
}

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
