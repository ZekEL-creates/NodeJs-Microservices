import { NextFunction, Request, Response } from "express";
import { AppError, successResponse, UserRole } from "shared";
import {
  getAllUserAttachments,
  uploadImageService,
} from "../service/media.service";

function requireIdentity(req: Request): { userId: string; role: string } {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!userId || !role) {
    throw new AppError(401, "Missing user identity");
  }
  return { userId, role };
}

export async function uploadAttachment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requireIdentity(req);
    const taskId = String(req.params.taskId);

    console.log(req.file);

    const attachment = await uploadImageService({
      taskId,
      userId,
      role,
      file: req.file,
    });

    successResponse(res, attachment, 201);
  } catch (error) {
    next(error);
  }
}

export async function getAllUploadsByUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requireIdentity(req);
    const taskId = String(req.params.taskId);
    const userAttachments = await getAllUserAttachments(taskId, userId, role);

    successResponse(res, userAttachments);
  } catch (error) {
    next(error);
  }
}
