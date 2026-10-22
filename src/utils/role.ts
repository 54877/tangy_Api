import { AuthenticatedRequest } from "../middlewares/auth";
import { UserRole } from "../types/authType";
import { AppError } from "./errors";

export const getUserRole = (role: string): UserRole => {
  if (role === "admin") {
    return "admin";
  }

  return "user";
};

export const isAdmin = (req: AuthenticatedRequest) => {
  if (req.user.role !== "admin") {
    throw new AppError("權限不足", 403);
  }
  return true;
};

