import multer from "multer";
import { AppError } from "shared";

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new AppError(400, "File type of image required"));
      return;
    }
    callback(null, true);
  },
}).single("image");
