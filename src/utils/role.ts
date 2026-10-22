import { AuthRequest } from "../middlewares/auth";
import { UserRole } from "../types/authType";
import { AppError } from "./errors";

export const getUserRole = (role: string): UserRole => {
  if (role === "admin") {
    return "admin";
  }

  return "user";
};

export const isAdmin = (req: AuthRequest) => {
  if (!req.user) {
    throw new AppError("未登入", 401);
  }
  if (req.user.role !== "admin") {
    throw new AppError("權限不足", 403);
  }
  return true;
};

