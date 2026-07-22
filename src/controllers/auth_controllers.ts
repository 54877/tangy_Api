import {
  loginUserLogic,
  logoutLogic,
  newPasswordLogic,
  registerUserLogic,
  sendEmail,
} from "../services/auth_services";
import { AsyncFunction } from "../types/asyncType";
import jwt from "jsonwebtoken";
import { createAccessToken, TokenPayload } from "../utils/jwt";

export const registerUser: AsyncFunction = async (req, res) => {
  const { password, userName, email } = req.body || {};
  await registerUserLogic({ password, userName, email });

  res.status(201).json({
    message: "註冊成功",
    state: true,
  });
};

export const loginUser: AsyncFunction = async (req, res) => {
  const { email, password } = req.body || {};
  const Token = await loginUserLogic({ email, password });
  const { refreshToken, accessToken, userDate } = Token;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    accessToken,
    userDate,
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

export const logoutControllers: AsyncFunction = async (req, res) => {
  await logoutLogic();
  res.clearCookie("refreshToken");
  res.status(200).json({
    message: "成功登出",
    state: true,
  });
};

//access過期替換
export const refresh: AsyncFunction = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET!,
  ) as TokenPayload;

  const accessToken = createAccessToken({
    id: payload.id,
    email: payload.email,
    role: payload.role,
  });

  res.status(200).json({
    accessToken,
    message: "成功替換",
    state: true,
  });
};
