import {
  getPersonalByIdLogic,
  updatePasswordLogic,
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
  const id = req.user?.id;
  const { userName, gender, introduction, birthday } = req.body || {};
  await updatePersonalByIdLogic(id, userName, gender, introduction, birthday);

  res.status(201).json({
    message: "更新成功",
    state: true,
  });
};

export const updatePassword: JwtAsyncFunction = async (req, res) => {
  const { newPassword, oldPassword, id } = req.body || {};
  await updatePasswordLogic(newPassword, oldPassword, id);

  res.status(201).json({
    message: "更新成功",
    state: true,
  });
};
