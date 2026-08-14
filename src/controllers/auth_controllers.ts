import { UAParser } from "ua-parser-js";
import {
  isSvLogic,
  loginUserLogic,
  logoutLogic,
  newPasswordLogic,
  refreshTokenLogic,
  registerUserLogic,
  sendEmail,
  verifyLoginUser,
} from "../services/auth_services";
import { AsyncFunction } from "../types/asyncType";
import { createAccessToken } from "../utils/jwt";

//註冊
export const registerUser: AsyncFunction = async (req, res) => {
  const { password, userName, email } = req.body || {};
  await registerUserLogic({ password, userName, email });

  res.status(201).json({
    message: "註冊成功",
    state: true,
  });
};

//登入
export const loginUser: AsyncFunction = async (req, res) => {
  const { email, password } = req.body || {};
  const userAgent = req.headers["user-agent"] ?? "unknown";
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  console.log(result);

  const ip = req.ip ?? "unknown";

  const user = await verifyLoginUser(email, password);

  const isSV = await isSvLogic(email);

  if (isSV) {
    res.status(200).json({
      svType: true,
      message: "驗證碼成功寄出",
      state: true,
    });
    return;
  }
  const Token = await loginUserLogic({ user, userAgent, ip });
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

//登入SV
export const loginUserSV: AsyncFunction = async (req, res) => {
  const { email, code, password } = req.body || {};
  //裝置資訊
  const userAgent = req.headers["user-agent"] ?? "unknown";
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  console.log(result);

  const ip = req.ip ?? "unknown";
  const user = await verifyLoginUser(email, password, code);

  const Token = await loginUserLogic({ user, userAgent, ip });

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

//寄信
export const sendEmailControllers: AsyncFunction = async (req, res) => {
  const { email } = req.body || {};
  await sendEmail(email);

  res.status(201).json({
    message: "email存在",
    state: true,
  });
};

//更新密碼
export const newPassword: AsyncFunction = async (req, res) => {
  const { email, code, newPassword } = req.body || {};
  await newPasswordLogic(email, code, newPassword);

  res.status(200).json({
    message: "密碼更新成功",
    state: true,
  });
};

//登出
export const logoutControllers: AsyncFunction = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await logoutLogic(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    message: "成功登出",
    state: true,
  });
};

//access過期替換
export const refresh: AsyncFunction = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const userAgent = req.headers["user-agent"] ?? "unknown";
  const ip = req.ip ?? "unknown";

  const { newPayload, newRefreshToken } = await refreshTokenLogic(
    refreshToken,
    userAgent,
    ip,
  );

  //建立新access token
  const accessToken = createAccessToken({
    id: newPayload.id,
    userName: newPayload.userName,
    email: newPayload.email,
    role: newPayload.role,
  });

  //設置新cookies refresh token
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    accessToken,
    message: "成功替換",
    state: true,
  });
};
