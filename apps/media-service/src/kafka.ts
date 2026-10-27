import { createProducer, publishJsonSafe, TOPICS } from "shared";

let producer: Awaited<ReturnType<typeof createProducer>> | null = null;

export async function initKafka() {
  producer = await createProducer("media-service");
}

export async function publishAttachmentEvent(taskId: string, userId: string) {
  await publishJsonSafe(
    producer,
    TOPICS.MEDIA_EVENT,
    {
      eventId: "attachment.uploaded",
      taskId,
      userId,
      message: "Attachment uploaded successfully",
      timeStamp: new Date().toISOString(),
    },
    taskId,
  );
}
