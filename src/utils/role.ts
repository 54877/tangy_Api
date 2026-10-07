import { AuthenticatedRequest } from "../middlewares/auth";
import { UserRole } from "../types/authType";

export const getUserRole = (role: string): UserRole => {
  if (role === "admin") {
    return "admin";
  }

  return "user";
};

export const isAdmin = (req: AuthenticatedRequest) => {
  if (req.user.role !== "admin") {
    throw new Error("權限不足");
  }
  return true;
};
