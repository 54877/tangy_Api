import {
  getPersonalByIdLogic,
  updatePersonalByIdLogic,
} from "../services/profile_service";
import { JwtAsyncFunction } from "../types/asyncType";

//個人資料
export const getPersonal: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;

  const { userDate, genderSelect } = await getPersonalByIdLogic(id);

  res.status(200).json({
    userDate,
    genderSelect,
    message: "成功",
    state: true,
  });
};

export const updatePersonal: JwtAsyncFunction = async (req, res) => {
  const { userDate } = req.body || {};
  await updatePersonalByIdLogic(userDate);

  res.status(201).json({
    message: "更新成功",
    state: true,
  });
};
