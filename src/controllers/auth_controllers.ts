import {
  loginUserLogic,
  newPasswordLogic,
  registerUserLogic,
  sendEmail,
} from "../services/auth_services";
import { AsyncFunction } from "../types/asyncType";

export const registerUser: AsyncFunction = async (req, res) => {
  const { password, user_name, email } = req.body || {};
  await registerUserLogic({ password, user_name, email });

  res.status(201).json({
    message: "註冊成功",
    state: true,
  });
};

export const loginUser: AsyncFunction = async (req, res) => {
  const { email, password } = req.body || {};
  const accessToken = await loginUserLogic({ email, password });

  res.status(201).json({
    accessToken,
    message: "登入成功",
    state: true,
  });
};

export const sendEmailControllers: AsyncFunction = async (req, res) => {
  const { email } = req.body || {};
  await sendEmail(email);

  res.status(201).json({
    message: "email存在",
    state: true,
  });
};

export const newPassword: AsyncFunction = async (req, res) => {
  const { email, code, newPassword } = req.body || {};
  await newPasswordLogic(email, code, newPassword);

  res.status(200).json({
    message: "密碼更新成功",
    state: true,
  });
};
