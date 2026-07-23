import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
  // JWT 錯誤
  if (
    err instanceof jwt.TokenExpiredError ||
    err instanceof jwt.JsonWebTokenError
  ) {
    return res.status(401).json({
      state: false,
      errors: {
        message: "Refresh Token 無效",
      },
    });
  }

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
