import { AppError } from "shared";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repository/auth.repository";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schemas";
import { User } from "../types/auth.types";
import bcrypt from "bcryptjs";
import { signAccessToken } from "shared";

export async function register(input: RegisterSchema): Promise<User> {
  const userExists = await findUserByEmail(input.email);
  if (userExists) {
    throw new AppError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await createUser({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });
  return user;
}

export async function loginUser(
  input: LoginSchema,
): Promise<{ user: User; accessToken: string }> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new AppError(401, "Invalid Email or password");
  }
  const validatePassword = bcrypt.compare(input.password, user.password_hash);
  if (!validatePassword) {
    throw new AppError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken(user);

  return {
    user,
    accessToken,
  };
}

export async function getCurrentUser(userId: string): Promise<User> {
  console.log("Got to service");
  const user = await findUserById(userId);
  console.log(user);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}
