import express from "express";
import { config } from "dotenv";
import { resolve } from "path";
import {
  errorHandler,
  httpLogger,
  logger,
  notFound,
  requireGateway,
  successResponse,
} from "shared";
import { taskRouter } from "./routes/usertask.routes";
import { initKafka } from "./kafka";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const app = express();

const PORT = process.env.TASK_PORT || 3002;

app.use(express.json());
app.use(httpLogger);

app.get("/health", (_req, res, _next) => {
  successResponse(res, {
    service: "Task service",
  });
});

app.use("/tasks", requireGateway, taskRouter);

app.use(notFound);
app.use(errorHandler);

async function initStartUp() {
  try {
    await initKafka();
  } catch (error) {
    logger.error({ error }, "Kafka producer init failed");
  }

  app.listen(PORT, () => {
    logger.info(`Task service running on PORT ${PORT}`);
  });
}

initStartUp();
