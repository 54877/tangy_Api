import { genderSelect } from "../constants/gender";
import { getUserById } from "../repository/nav_Repository";
import { updateUserById } from "../repository/profile_Repository";
import { UserProfileType } from "../types/profileType";
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

export const updatePersonalByIdLogic = async (userDate: UserProfileType) => {
  if (!userDate.id) {
    throw new AppError("未登入", 401);
  }

  await updateUserById(userDate);
};
