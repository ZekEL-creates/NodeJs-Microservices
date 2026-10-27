import { AppError, createConsumer, logger, runConsumer, TOPICS } from "shared";
import { PublishedData, Workflow } from "../types/types";
import {
  createWorkflow,
  getUserFortask,
  getWorkflowsByTaskId,
} from "../repository/workflow.repository";

async function handlePublishedMessage(rawData: PublishedData) {
  if (!rawData.eventType || !rawData.taskId || !rawData.userId) {
    logger.warn({ rawData }, "Invalid published event");
    return;
  }

  const workflow = await createWorkflow({
    taskId: rawData.taskId,
    eventType: rawData.eventType,
    message: rawData.message || rawData.eventType,
    createdBy: rawData.userId,
  });

  logger.info(
    {
      workflowId: workflow.id,
      workflowEvent: workflow.event_type,
    },
    "Workflow created successfully",
  );
}

export async function startKafkaConsumer() {
  const consumer = await createConsumer(
    "workflow-service",
    "workflow-service-group",
  );
  await runConsumer(
    consumer,
    [TOPICS.MEDIA_EVENT, TOPICS.TASK_EVENT],
    async ({ message }) => {
      const value = message.value?.toString();
      if (!value) return;
      try {
        await handlePublishedMessage(JSON.parse(value) as PublishedData);
      } catch (error) {
        logger.warn({ error }, "Workflow consumer failed");
      }
    },
  );
}

export async function getWorkflowService(
  taskId: string,
  userId: string,
  role: string,
): Promise<Workflow[]> {
  const taskByUser = await getUserFortask(taskId);
  if (!taskByUser) {
    throw new AppError(404, "task not found");
  }

  if (role !== "ADMIN" && taskByUser.created_by !== userId) {
    throw new AppError(403, "Forbidden: you cannot access this workflow");
  }

  return await getWorkflowsByTaskId(taskId);
}
