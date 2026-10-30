import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";

export class AppError extends Error {
  statusCode: number;
  field?: string;
  details?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    field?: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.field = field;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const imageUploadType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.uploadType = "image";
  next();
};

export const videoUploadType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.uploadType = "video";
  next();
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // JWT 錯誤
  if (
    err instanceof jwt.TokenExpiredError ||
    err instanceof jwt.JsonWebTokenError
  ) {
    return res.status(401).json({
      state: false,
      errors: { message: "Token 無效" },
    });
  }
  const multerMessage =
    req.uploadType === "video"
      ? "影片大小不可超過 50 MB"
      : "圖片大小不可超過 5 MB";

  // Multer 錯誤
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        state: false,
        errors: {
          message: multerMessage,
        },
      });
    }
  }

  const parseError =
    err instanceof SyntaxError && "status" in err && err.status === 400;
  let statusCode = 500;
  let message = "伺服器錯誤";
  let errors: Record<string, string | string[]> = { message };

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    if (err.details) {
      errors = err.details;
    } else if (err.field) {
      errors = { [err.field]: [message] };
    } else {
      errors = { message };
    }
  } else if (parseError) {
    statusCode = 400;
    message = "請求格式錯誤";
    errors = { message };
  }
  console.error(`[API Error] ${req.method} ${req.originalUrl}`, {
    statusCode,
    errors,
    stack: err instanceof Error ? err.stack : undefined,
  });
  res.status(statusCode).json({
    state: false,
    errors,
  });
};
