import { NextFunction, Request, Response } from "express";
import { AppError, UserRole, verifyAccessToken } from "shared";
import { getAllowedRolesForPath, isPublicRoute } from "../rbac";

const IDENTITY_HEADERS = [
  "x-user-id",
  "x-user-role",
  "x-gateway-secret",
] as const;

//don't trust any header received from clients
function stripIdentityHeaders(req: Request) {
  for (const header of IDENTITY_HEADERS) {
    delete req.headers[header];
  }
}

function attachUserHeaders(req: Request, id: string, role: UserRole) {
  req.headers["x-user-id"] = id;
  req.headers["x-user-role"] = role;
}

//proves to services that incoming requests came through the gateway
function attachGatewaySecret(req: Request) {
  const gatewaySecret = process.env.GATEWAY_SECRET;

  if (!gatewaySecret) {
    throw new AppError(500, "Gateway secret not configured");
  }

  req.headers["x-gateway-secret"] = gatewaySecret;
}

function requestPath(req: Request) {
  const combined = `${req.baseUrl}${req.path}`;
  if (combined.length > 1 && combined.endsWith("/")) {
    return combined.slice(0, -1);
  }

  return combined || "/";
}

export function gatewayAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    console.log("Gate way middleware");
    stripIdentityHeaders(req);
    attachGatewaySecret(req);

    const path = requestPath(req);
    console.log(path);

    //if path is a public route then we don't need authentication
    const publicRoute = isPublicRoute(req.method, path);
    if (publicRoute) {
      return next();
    }

    const authHeader = req.header("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Missing or invalid token");
    }
    const token = authHeader.split(" ")[1].trim();
    const tokenPayload = verifyAccessToken(token);

    //get all allowed roles to this path
    const allowedRoles = getAllowedRolesForPath(req.method, path);
    if (!allowedRoles) {
      throw new AppError(404, "Route not found");
    }

    console.log("ALLOWED ROLES", allowedRoles);

    if (!allowedRoles.includes(tokenPayload.role)) {
      console.log("Not allowed");
      throw new AppError(403, "Forbidden");
    }

    attachUserHeaders(req, tokenPayload.id, tokenPayload.role);
    console.log("GATEWAY MIDDLEWARE END");

    next();
    console.log(req.header("x-user-id"));
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError(401, "Invalid or expired token"));
  }
}
