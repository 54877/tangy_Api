import { getUserById } from "../repository/nav_Repository";
import { AppError } from "../utils/errors";

//get user (nav)
export const getUserByIdLogic = async (id: string | undefined) => {
  if (!id) {
    throw new AppError("未登入", 401);
  }

  const user = await getUserById(id);

  if (!user) {
    throw new AppError("查無資料", 400);
  }

  return {
    id: user.id,
    email: user.email,
    userName: user.userName,
    svType: user.svType,
    role: user.role,
  };
};
