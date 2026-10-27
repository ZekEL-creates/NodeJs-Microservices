import { dbPool } from "shared";
import { Attachment } from "../types/media.types";

export async function confirmTaskAccess(
  taskId: string,
): Promise<{ id: string; created_by: string } | null> {
  const result = await dbPool().query<{ id: string; created_by: string }>(
    `
    SELECT id, created_by FROM tasks WHERE id = $1`,
    [taskId],
  );

  return result.rows[0] ?? null;
}

export async function createAttachment(input: {
  task_id: string;
  uploaded_by: string;
  image_url: string;
  public_id: string;
}): Promise<Attachment> {
  const result = await dbPool().query(
    `
    INSERT INTO attachments (task_id, uploaded_by, image_url, public_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, task_id, uploaded_by, image_url, public_id, created_at
    `,
    [input.task_id, input.uploaded_by, input.image_url, input.public_id],
  );

  return result.rows[0];
}

export async function getAttachmentsByTaskId(
  taskId: string,
): Promise<Attachment[]> {
  const result = await dbPool().query<Attachment>(
    `
    SELECT id, task_id, uploaded_by, image_url, public_id, created_at
    FROM attachments 
    WHERE task_id = $1
    ORDER BY created_at`,
    [taskId],
  );

  return result.rows;
}
