import { NextFunction, Request, Response } from "express";

export async function notFound(_req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    message: "404 Route Not Found",
  });
}
