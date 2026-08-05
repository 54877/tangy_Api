import { genderSelect } from "../constants/gender";
import { getUserById } from "../repository/nav_Repository";
import { AppError } from "../utils/errors";

export const getPersonalByIdLogic = async (id: string | undefined) => {
  if (!id) {
    throw new AppError("未登入", 401);
  }

  const userDate = await getUserById(id);

  return {
    userDate,
    genderSelect,
  };
};
