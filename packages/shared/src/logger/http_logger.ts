import PinoHttp from "pino-http";
import { logger } from "./logger";

export const httpLogger = PinoHttp({
  logger,
});
