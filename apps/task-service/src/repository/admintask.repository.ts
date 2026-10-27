import { dbPool } from "shared";
import { Task } from "../types/task";

export async function getAllDbTasks(): Promise<Task[]> {
  const result = await dbPool().query<Task>(
    `SELECT id, title, status, created_by, created_at, updated_at
    FROM tasks
    ORDER BY created_at DESC`,
  );

  return result.rows;
}

export async function getTaskWithId(taskId: string): Promise<Task | null> {
  const result = await dbPool().query<Task>(
    `SELECT id, title, status, created_by, updated_by
    FROM tasks WHERE id = $1
    ORDER BY created_at DESC
    `,
    [taskId],
  );

  return result.rows[0] ?? null;
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const result = await dbPool().query<Task>(
    `DELETE FROM tasks WHERE id = $1
    `,
    [taskId],
  );

  return (result.rowCount ?? 0) > 0;
}
