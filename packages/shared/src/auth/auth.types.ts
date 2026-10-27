export type UserRole = "USER" | "ADMIN";

export type JwtPayload = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
