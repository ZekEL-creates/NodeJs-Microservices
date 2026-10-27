import { NextFunction, Request, Response, Router } from "express";
import {
  getAllUploadsByUser,
  uploadAttachment,
} from "../controllers/media.controller";
import { uploadMiddleware } from "../middleware/media.middleware";
import { AppError } from "shared";

export const mediaRouter = Router();

function handleUpload(req: Request, res: Response, next: NextFunction) {
  console.log("Handle upload");
  uploadMiddleware(req, res, (error: unknown) => {
    console.log("Maybe there is an error");
    if (!error) {
      console.log("Got to this place");
      console.log(req.headers["content-type"]);
      console.log("In Multer", req.file);
      return next();
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      throw new AppError(400, "Maximum size of file should be 10mb");
    }
    throw new AppError(400, "Invalid image upload");
  });
}

mediaRouter.post("/:taskId/attachments", handleUpload, uploadAttachment);
mediaRouter.get("/:taskId/attachments", getAllUploadsByUser);
