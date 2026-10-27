import { JwtPayload } from "./auth.types";
import jwt from "jsonwebtoken";

export function signAccessToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret not set");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret not set");
  }
  const user = jwt.verify(token, secret);
  if (
    typeof user !== "object" ||
    typeof user.id !== "string" ||
    (user.role !== "USER" && user.role !== "ADMIN")
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };
}
