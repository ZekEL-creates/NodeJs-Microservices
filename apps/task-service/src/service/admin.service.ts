import { AppError } from "shared";
import {
  deleteTask,
  getAllDbTasks,
  getTaskWithId,
} from "../repository/admintask.repository";
import { Task } from "../types/task";

export async function getAllTasks(): Promise<Task[]> {
  const tasks = await getAllDbTasks();
  return tasks;
}

export async function getSingleAdminTask(taskId: string): Promise<Task | null> {
  const task = await getTaskWithId(taskId);
  if (!task) {
    throw new AppError(404, "Task not found");
  }
  return task;
}

export async function deleteTaskAsAdmin(taskId: string): Promise<string> {
  const task = await deleteTask(taskId);
  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return taskId;
}
