import dotenv from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
  errorHandler,
  httpLogger,
  logger,
  notFound,
  requireGateway,
  successResponse,
} from "shared";
import { authRouter } from "./routes/auth.routes";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.AUTH_PORT;

const app = express();
app.use(httpLogger);
app.use(express.json());

app.get("/health", (_req, res, _next) => {
  successResponse(res, {
    service: "Auth-Service",
  });
});

app.use("/auth", requireGateway, authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Auth Service running on PORT ${PORT}`);
});
