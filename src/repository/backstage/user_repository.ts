import prisma from "../../db/prisma";
import { AppError } from "../../utils/errors";

export const getAllUsersDb = async () => prisma.user.findMany();

export const editUserRoleDb = async (id: string, role: string) => {
  try {
    return await prisma.user.update({ where: { id }, data: { role } });
  } catch (err: any) {
    if (err.code === "P2025") throw new AppError("使用者不存在", 404);
    throw err;
  }
};
