import {
  getPersonalByIdLogic,
  sendSVEmail,
  SV,
  svClose,
  updatePasswordLogic,
  updatePersonalByIdLogic,
} from "../services/profile_service";
import { JwtAsyncFunction } from "../types/asyncType";

//個人資料
export const getPersonal: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;

  const { userDate, genderSelect, deviceDate } = await getPersonalByIdLogic(id);

  res.status(200).json({
    userDate,
    genderSelect,
    deviceDate,
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
  const id = req.user?.id;
  const { newPassword, oldPassword } = req.body || {};
  await updatePasswordLogic(newPassword, oldPassword, id);

  res.status(201).json({
    message: "更新成功",
    state: true,
  });
};

//寄信
export const sendSVEmailControllers: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;
  const { email } = req.body || {};
  await sendSVEmail(id, email);

  res.status(201).json({
    message: "email已寄出",
    state: true,
  });
};

//sv開啟
export const svControllers: JwtAsyncFunction = async (req, res) => {
  const { email, code } = req.body || {};
  await SV(email, code);

  res.status(201).json({
    message: "成功開啟2FA",
    state: true,
  });
};

//sv關閉
export const svCloseControllers: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;
  await svClose(id);

  res.status(201).json({
    message: "成功關閉2FA",
    state: true,
  });
};
