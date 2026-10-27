import { dbPool } from "shared";
import { Task } from "../types/task";

export async function createTask(
  title: string,
  created_by: string,
): Promise<Task> {
  const result = await dbPool().query<Task>(
    `INSERT INTO tasks (title, created_by)
    VALUES ($1, $2)
    RETURNING id, title, status, created_by, created_at, updated_at`,
    [title, created_by],
  );

  return result.rows[0];
}

export async function getAllUserTasks(userId: string): Promise<Task[]> {
  const result = await dbPool().query<Task>(
    `SELECT id, title, status, created_by, created_at, updated_at
    FROM tasks WHERE created_by = $1
    ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
}

export async function getTaskWithId(
  userId: string,
  taskId: string,
): Promise<Task | null> {
  const result = await dbPool().query<Task>(
    `SELECT id, title, status, created_by, created_at, updated_at
    FROM tasks WHERE id = $1 AND created_by = $2
    ORDER BY created_at DESC
    `,
    [taskId, userId],
  );

  return result.rows[0] ?? null;
}

export async function deleteTask(
  userId: string,
  taskId: string,
): Promise<boolean> {
  const result = await dbPool().query<Task>(
    `DELETE FROM tasks WHERE id = $1 AND created_by = $2`,
    [taskId, userId],
  );

  return (result.rowCount ?? 0) > 0;
}

export async function updateUsertaskRepository(
  userId: string,
  taskId: string,
  newTitle: string,
): Promise<Task | null> {
  const result = await dbPool().query(
    `UPDATE tasks
    SET title = $1, updated_at = NOW()
    WHERE id = $2 AND userId = $3
    RETURNING id, title, status, created_by, created_at, updated_at
    `,
    [newTitle, taskId, userId],
  );

  return result.rows[0] ?? null;
}
