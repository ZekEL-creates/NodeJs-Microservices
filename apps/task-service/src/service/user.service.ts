import { AppError } from "shared";
import {
  createTask,
  deleteTask,
  getAllUserTasks,
  getTaskWithId,
  updateUsertaskRepository,
} from "../repository/usertask.repository";
import { TaskInput } from "../schemas/task.schemas";
import { Task } from "../types/task";
import { publishTaskEvent } from "../kafka";

export async function createTaskService(
  input: TaskInput,
  userId: string,
): Promise<Task> {
  const newTask = await createTask(input.title, userId);

  //A Kafka event will publish after a new task is created
  await publishTaskEvent(newTask.id, userId);

  return newTask;
}

export async function getUserTaskService(userId: string): Promise<Task[]> {
  const userTasks = await getAllUserTasks(userId);
  return userTasks;
}

export async function getSingleTaskService(
  userId: string,
  taskId: string,
): Promise<Task | null> {
  const task = await getTaskWithId(userId, taskId);
  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return task;
}

export async function deleteUserTask(
  userId: string,
  taskId: string,
): Promise<string> {
  const task = await deleteTask(userId, taskId);
  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return taskId;
}

export async function updateTaskService(
  userId: string,
  taskId: string,
  newTitle: string,
): Promise<Task> {
  const updatedTask = await updateUsertaskRepository(userId, taskId, newTitle);
  if (!updatedTask) {
    throw new AppError(404, "Task not found for this user");
  }

  return updatedTask;
}
