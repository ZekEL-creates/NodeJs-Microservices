import { NextFunction, Request, Response } from "express";
import { AppError, successResponse } from "shared";
import {
  createTaskService,
  deleteUserTask,
  getSingleTaskService,
  getUserTaskService,
  updateTaskService,
} from "../service/user.service";

function getUserIdAndRoleFromReqHeader(req: Request): {
  userId: string;
  role: string;
} {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!userId || !role) {
    throw new AppError(401, "Missing user Identity");
  }
  return { userId, role };
}

export async function createUserTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = getUserIdAndRoleFromReqHeader(req);
    const task = await createTaskService(req.body, userId);
    successResponse(res, task, 201);
  } catch (error) {
    next(error);
  }
}

export async function getUserTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = getUserIdAndRoleFromReqHeader(req);
    const userTasks = await getUserTaskService(userId);

    successResponse(res, userTasks);
  } catch (error) {
    next(error);
  }
}

export async function getSingleTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = getUserIdAndRoleFromReqHeader(req);
    const taskId = String(req.params.id);
    const task = await getSingleTaskService(userId, taskId);

    successResponse(res, task);
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const taskId = String(req.params.id);
    const { userId } = getUserIdAndRoleFromReqHeader(req);

    const deletedtask = await deleteUserTask(userId, taskId);
    successResponse(res, deletedtask);
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { newTitle } = req.body;
    const { userId } = getUserIdAndRoleFromReqHeader(req);
    const taskId = String(req.params.id);

    const updatedTask = updateTaskService(userId, taskId, newTitle);

    successResponse(res, updatedTask);
  } catch (error) {
    next(error);
  }
}
