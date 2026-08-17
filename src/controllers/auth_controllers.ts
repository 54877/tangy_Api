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
import { Request, Response } from "express";
import { AsyncFunction } from "../types/asyncType";
import { createAccessToken } from "../utils/jwt";

const getLoginData = async (req: Request) => {
  const { email, password, code } = req.body || {};
  const userAgent = req.headers["user-agent"] ?? "unknown";
  const ip = req.ip ?? "unknown";
  const deviceId = req.cookies.deviceId;
  const user = await verifyLoginUser(email, password, code);

  return { userAgent, ip, deviceId, user, email };
};

// const cookiesFn = (res: Response, refreshToken: string, deviceId?: string) => {
//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   if (deviceId) {
//     res.cookie("deviceId", deviceId, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//   }
// };

const cookiesFn = (res: Response, refreshToken: string, deviceId?: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  console.log("登入產生 deviceId:", deviceId);

  if (deviceId) {
    res.cookie("deviceId", deviceId, cookieOptions);
  }
};

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
  const { userAgent, ip, deviceId, user, email } = await getLoginData(req);

  const isSV = await isSvLogic(email);

  if (isSV) {
    res.status(200).json({
      svType: true,
      message: "驗證碼成功寄出",
      state: true,
    });
    return;
  }

  const Token = await loginUserLogic({ user, userAgent, ip, deviceId });

  const { refreshToken, accessToken, userDate, id } = Token;

  //建立cookies
  cookiesFn(res, refreshToken, id);

  res.status(201).json({
    accessToken,
    userDate,
    message: "登入成功",
    state: true,
  });
};

//登入SV
export const loginUserSV: AsyncFunction = async (req, res) => {
  const { userAgent, ip, deviceId, user } = await getLoginData(req);

  const Token = await loginUserLogic({ user, userAgent, ip, deviceId });

  const { refreshToken, accessToken, userDate, id } = Token;

  //建立cookies
  cookiesFn(res, refreshToken, id);

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
  const deviceId = req.cookies.deviceId;
  await logoutLogic(refreshToken, deviceId);

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
  const ip = req.ip ?? "unknown";
  const refreshToken = req.cookies.refreshToken;
  const { newPayload, newRefreshToken } = await refreshTokenLogic(
    refreshToken,
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
  cookiesFn(res, newRefreshToken);

  res.status(200).json({
    accessToken,
    message: "成功替換",
    state: true,
  });
};
