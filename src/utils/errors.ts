import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  field?: string;

  constructor(message: string, statusCode: number, field?: string) {
    super(message);
    this.statusCode = statusCode;
    this.field = field;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  const message = err instanceof Error ? err.message : "伺服器錯誤";
  const errors =
    err instanceof AppError && err.field
      ? { [err.field]: message }
      : { message };

  res.status(statusCode).json({
    state: false,
    errors,
  });
};
