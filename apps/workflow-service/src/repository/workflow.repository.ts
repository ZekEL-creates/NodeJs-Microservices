import { dbPool } from "shared";
import { Workflow } from "../types/types";

export async function createWorkflow(input: {
  taskId: string;
  eventType: string;
  message: string;
  createdBy: string;
}): Promise<Workflow> {
  const result = await dbPool().query(
    `
    INSERT INTO workflows (task_id, event_type, message, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING id, task_id, event_type, message, created_by, created_at`,
    [input.taskId, input.eventType, input.message, input.createdBy],
  );

  return result.rows[0];
}

export async function getWorkflowsByTaskId(
  taskId: string,
): Promise<Workflow[]> {
  const result = await dbPool().query<Workflow>(
    `
    SELECT id, task_id, event_type, message, created_by, created_at
    FROM workflows 
    WHERE task_id = $1
    `,
    [taskId],
  );

  return result.rows;
}

export async function getUserFortask(
  taskId: string,
): Promise<{ created_by: string } | null> {
  const result = await dbPool().query<{ created_by: string }>(
    `
    SELECT created_by FROM tasks
    WHERE id = $1
    `,
    [taskId],
  );

  return result.rows[0] ?? null;
}
