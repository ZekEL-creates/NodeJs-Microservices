import { config } from "dotenv";
import { resolve } from "node:path";
import {
  errorHandler,
  httpLogger,
  logger,
  notFound,
  requireGateway,
  successResponse,
} from "shared";
import express from "express";
import { startKafkaConsumer } from "./services/workflow.services";
import { workflowRouter } from "./routes/workflow.routes";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.WORKFLOW_PORT || 3004;

const app = express();

app.use(httpLogger);
app.use(express.json());

app.get("/health", (_req, res, _next) => {
  successResponse(res, {
    service: "workflow-service",
  });
});

app.use("/tasks", requireGateway, workflowRouter);

app.use(notFound);
app.use(errorHandler);

async function initStart() {
  try {
    await startKafkaConsumer();
  } catch (error) {
    logger.error({ error }, "Kafka consumer init failed");
  }
  app.listen(PORT, () => {
    logger.info(`Workflow service running on PORT ${PORT}`);
  });
}

initStart();
