import dotenv from "dotenv";
import { resolve } from "node:path";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {
  errorHandler,
  httpLogger,
  logger,
  notFound,
  successResponse,
} from "shared";
import { createProxyMiddleware } from "http-proxy-middleware";
import { gatewayAuthMiddleware } from "./middleware/gatewayAuth.middleware";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";

const TASK_SERVICE_URL =
  process.env.TASK_SERVICE_URL || "http://localhost:3002";

const MEDIA_SERVICE_URL =
  process.env.MEDIA_SERVICE_URL || "http://localhost:3003";

const WORKFLOW_SERVICE_URL =
  process.env.WORKFLOW_SERVICE_URL || "http://localhost:3004";

const app = express();

//secure http headers
app.use(helmet());

app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false,
  }),
);

app.use(httpLogger);
app.get("/health", (_req: Request, res: Response, _next: NextFunction) => {
  successResponse(res, {
    service: "API Gateway",
  });
});

//create proxy
app.use(
  "/auth",
  gatewayAuthMiddleware,
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/auth${path}`,
  }),
);

const taskProxy = createProxyMiddleware({
  target: TASK_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/tasks${path}`,
});

const mediaProxy = createProxyMiddleware({
  target: MEDIA_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/tasks${path}`,
});

const workflowProxy = createProxyMiddleware({
  target: WORKFLOW_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/tasks${path}`,
});

app.use("/tasks", gatewayAuthMiddleware, (req, res, next) => {
  if (req.path.includes("attachments")) {
    return mediaProxy(req, res, next);
  }
  if (req.path.includes("workflows")) {
    return workflowProxy(req, res, next);
  }
  return taskProxy(req, res, next);
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway running on PORT ${PORT}`);
});
