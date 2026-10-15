import { Response } from "express";

export const success = (
  res: Response,
  statusCode: number,
  dataSet?: unknown,
  message = "成功",
) => {
  res.status(statusCode).json({
    dataSet,
    message,
    state: true,
  });
};
