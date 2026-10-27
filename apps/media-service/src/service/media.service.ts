import { AppError } from "shared";
import { Attachment } from "../types/media.types";
import {
  confirmTaskAccess,
  createAttachment,
  getAttachmentsByTaskId,
} from "../repository/media.repository";
import { uploadFileBuffer } from "../utils/objectStorage";
import { publishAttachmentEvent } from "../kafka";

async function confirmIfUserCanUploadForThisTask(
  taskId: string,
  userId: string,
  role: string,
) {
  const task = await confirmTaskAccess(taskId);
  if (!task) {
    throw new AppError(404, "Task not found");
  }
  if (role !== "ADMIN" && task.created_by !== userId) {
    throw new AppError(
      403,
      "Forbidden from uploading or viewing images for this task",
    );
  }
}

export async function uploadImageService(input: {
  taskId: string;
  userId: string;
  role: string;
  file?: Express.Multer.File;
}): Promise<Attachment> {
  if (!input.file) {
    throw new AppError(400, "Upload an Image file");
  }

  await confirmIfUserCanUploadForThisTask(
    input.taskId,
    input.userId,
    input.role,
  );

  const uploadedFile = await uploadFileBuffer(
    input.file.buffer,
    input.file.mimetype || "image/jpeg",
  );

  const attachment = await createAttachment({
    task_id: input.taskId,
    image_url: uploadedFile.imageUrl,
    public_id: uploadedFile.publicId,
    uploaded_by: input.userId,
  });

  //Publish event for attachment upload
  await publishAttachmentEvent(input.taskId, input.userId);
  return attachment;
}

export async function getAllUserAttachments(
  taskId: string,
  userId: string,
  role: string,
): Promise<Attachment[]> {
  await confirmIfUserCanUploadForThisTask(taskId, userId, role);
  const attachments = await getAttachmentsByTaskId(taskId);
  return attachments;
}
