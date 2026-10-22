import {
  editUserRoleDb,
  getAllUsersDb,
} from "../../repository/backstage/user_repository";
import { getUserById } from "../../repository/nav_Repository";
import { AppError } from "../../utils/errors";

export const getAllUsersLogic = () => getAllUsersDb();

export const editUserRoleLogic = async (id: string, userId: string) => {
  if (id === userId) throw new AppError("不可修改自己權限", 403);
  const user = await getUserById(id);
  await editUserRoleDb(id, user?.role === "user" ? "admin" : "user");
};
