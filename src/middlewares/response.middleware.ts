import { Response } from "express";

export function sendResponse(
  res: Response,
  status: number,
  message: string | null,
  data?: any
) {
  return res.status(status).json({ success: true, message, data });
}
