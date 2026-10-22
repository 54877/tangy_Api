import { NextFunction, Response } from "express";
import { AuthRequest, AuthenticatedRequest } from "./auth";
import { AppError } from "../utils/errors";
import { isAdmin } from "../utils/role";

export const adminMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    if (!req.user) {
      throw new AppError("未登入", 401);
    }
    isAdmin(req as AuthenticatedRequest);
    next();
  } catch (error) {
    next(error);
  }
};
