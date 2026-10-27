import { NextFunction, Request, Response } from "express";
import { AppError, successResponse } from "shared";
import { getWorkflowService } from "../services/workflow.services";

function requireIdentity(req: Request): { userId: string; role: string } {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!userId || !role) {
    throw new AppError(401, "Missing user Identity");
  }

  return { userId, role };
}

export async function getWorkflowsByTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requireIdentity(req);
    const taskId = String(req.params.taskId);
    const workflow = await getWorkflowService(taskId, userId, role);
    successResponse(res, { workflow });
  } catch (error) {
    next(error);
  }
}
