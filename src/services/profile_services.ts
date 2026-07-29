import { getUserById } from "../repository/profile_Repository";
import { AppError } from "../utils/errors";

//get user
export const getUserByIdLogic = async (id: string | undefined) => {
  if (!id) {
    throw new AppError("未登入", 401);
  }

  const user = await getUserById(id);
  return {
    id: user?.id,
    email: user?.email,
    userName: user?.userName,
    role: user?.role,
  };
};
