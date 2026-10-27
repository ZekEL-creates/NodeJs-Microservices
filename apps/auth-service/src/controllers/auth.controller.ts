import { NextFunction, Request, Response } from "express";
import { AppError, successResponse } from "shared";
import { getCurrentUser, loginUser, register } from "../services/auth.services";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log("Code got here");
    const user = await register(req.body);
    successResponse(res, user, 201);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user, accessToken } = await loginUser(req.body);
    successResponse(res, {
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("Got Here");
    const userId = req.header("x-user-id");
    console.log(userId);
    if (!userId) {
      throw new AppError(401, "x-user-id is absent in req header");
    }

    const me = await getCurrentUser(userId);
    successResponse(res, {
      me,
    });
  } catch (error) {
    next(error);
  }
}
