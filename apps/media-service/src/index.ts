import express from "express";
import dotenv from "dotenv";
import { resolve } from "node:path";
import {
  errorHandler,
  httpLogger,
  logger,
  notFound,
  requireGateway,
  successResponse,
} from "shared";
import { mediaRouter } from "./routes/media.routes";
import { initKafka } from "./kafka";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.MEDIA_PORT || 3003;

const app = express();

app.use(express.json());

app.use(httpLogger);
app.get("/health", (req, res, next) => {
  successResponse(res, {
    service: "Media-Service",
  });
});

//routes
app.use("/tasks", requireGateway, mediaRouter);

app.use(notFound);
app.use(errorHandler);

async function initStartUp() {
  try {
    await initKafka();
  } catch (error) {
    logger.error({ error }, "Kafka producer failed");
  }

  app.listen(PORT, () => {
    logger.info(`Media service running on PORT ${PORT}`);
  });
}

initStartUp();
