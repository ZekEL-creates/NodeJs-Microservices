import { Request, NextFunction, Response } from "express";
import { successResponse } from "shared";
import {
  deleteTaskAsAdmin,
  getAllTasks,
  getSingleAdminTask,
} from "../service/admin.service";
import { getSingleTask } from "./user.controller";

export async function getTasks(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userTasks = await getAllTasks();

    successResponse(res, userTasks);
  } catch (error) {
    next(error);
  }
}

export async function getSingleAdminTaskController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const taskId = String(req.params.id);

    const task = await getSingleAdminTask(taskId);

    successResponse(res, task);
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const taskId = String(req.params.id);

    const deletedtask = await deleteTaskAsAdmin(taskId);
    successResponse(res, deletedtask);
  } catch (error) {
    next(error);
  }
}
