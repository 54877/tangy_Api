import { UserRole } from "../types/authType";

export const getUserRole = (role: string): UserRole => {
  if (role === "admin") {
    return "admin";
  }

  return "user";
};
