import { Producer, RecordMetadata } from "kafkajs";
import { createClient } from "./client";
import { logger } from "../logger/logger";

export async function createProducer(clientId: string): Promise<Producer> {
  const kafka = createClient(clientId);
  const producer = kafka.producer();

  await producer.connect();

  logger.info({ clientId }, "Producer connected successfully");
  return producer;
}

export async function publishJson(
  producer: Producer,
  topic: string,
  payload: Record<string, unknown>,
  key?: string,
): Promise<RecordMetadata[]> {
  const result = await producer.send({
    topic,
    messages: [
      {
        key: key ?? null,
        value: JSON.stringify(payload),
      },
    ],
  });

  logger.info({ topic, payload }, "Kafka event published successfully");
  return result;
}

export async function publishJsonSafe(
  producer: Producer | null,
  topic: string,
  payload: Record<string, unknown>,
  key?: string,
): Promise<void> {
  if (!producer) {
    logger.warn({ topic }, "Kafka producer not ready");
    return;
  }
  try {
    await publishJson(producer, topic, payload, key);
  } catch (error) {
    logger.error({ error, topic }, "Kafka publish failed");
  }
}
