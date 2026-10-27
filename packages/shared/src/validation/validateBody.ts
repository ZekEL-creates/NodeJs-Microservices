import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import { AppError } from "../errors/app_errors";
import { logger } from "../logger/logger";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    console.log("Started here");
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      logger.info(result.error.issues);
      logger.info(message);
      next(new AppError(400, message));
    }

    req.body = result.data;
    next();
  };
}
