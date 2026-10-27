import { Router } from "express";
import { validateBody } from "shared";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";
import {
  getMe,
  loginController,
  registerController,
} from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), registerController);
authRouter.post("/login", validateBody(loginSchema), loginController);
authRouter.get("/me", getMe);
