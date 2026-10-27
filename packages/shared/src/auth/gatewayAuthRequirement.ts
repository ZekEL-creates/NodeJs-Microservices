import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app_errors";

export function requireGateway(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const gatewaySecret = process.env.GATEWAY_SECRET;
  if (!gatewaySecret) {
    return next(new AppError(500, "Gateway secret is not configured"));
  }

  const secretByClient = req.header("x-gateway-secret");
  if (!secretByClient || secretByClient !== gatewaySecret) {
    return next(new AppError(403, "Forbidden, Gateway secret not provided"));
  }
  next();
}
