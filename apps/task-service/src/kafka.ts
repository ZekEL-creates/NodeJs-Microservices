import { createProducer, publishJsonSafe, TOPICS } from "shared";

let producer: Awaited<ReturnType<typeof createProducer>> | null = null;

export async function initKafka() {
  producer = await createProducer("task-service");
}

export async function publishTaskEvent(taskId: string, userId: string) {
  await publishJsonSafe(
    producer,
    TOPICS.TASK_EVENT,
    {
      eventType: "task.created",
      taskId,
      userId,
      message: "Task created successfully",
      timeStamp: new Date().toISOString(),
    },
    taskId,
  );
}
