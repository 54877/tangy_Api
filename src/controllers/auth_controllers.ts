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
import { success } from "../utils/success";

const getLoginData = async (req: Request) => {
  const { email, password, code } = req.body || {};
  const userAgent = req.headers["user-agent"] ?? "unknown";
  const ip = req.ip ?? "unknown";
  const deviceId = req.cookies.deviceId;
  const user = await verifyLoginUser(email, password, code);

  return { userAgent, ip, deviceId, user, email };
};

const cookiesFn = (res: Response, refreshToken: string, deviceId?: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  if (deviceId) {
    res.cookie("deviceId", deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
};

//註冊
export const registerUser: AsyncFunction = async (req, res) => {
  const { password, userName, email } = req.body || {};
  await registerUserLogic({ password, userName, email });

  success(res, 201, undefined, "註冊成功");
};

//登入
export const loginUser: AsyncFunction = async (req, res) => {
  const { userAgent, ip, deviceId, user, email } = await getLoginData(req);

  const isSV = await isSvLogic(email);

  if (isSV) {
    success(res, 200, { svType: true }, "驗證碼成功寄出");
    return;
  }

  const Token = await loginUserLogic({ user, userAgent, ip, deviceId });

  const { refreshToken, accessToken, userDate, id } = Token;

  //建立cookies
  cookiesFn(res, refreshToken, id);

  success(res, 201, { accessToken, userDate }, "登入成功");
};

//登入SV
export const loginUserSV: AsyncFunction = async (req, res) => {
  const { userAgent, ip, deviceId, user } = await getLoginData(req);

  const Token = await loginUserLogic({ user, userAgent, ip, deviceId });

  const { refreshToken, accessToken, userDate, id } = Token;

  //建立cookies
  cookiesFn(res, refreshToken, id);

  success(res, 201, { accessToken, userDate }, "登入成功");
};

//寄信
export const sendEmailControllers: AsyncFunction = async (req, res) => {
  const { email } = req.body || {};
  await sendEmail(email);

  success(res, 201, undefined, "email存在");
};

//更新密碼
export const newPassword: AsyncFunction = async (req, res) => {
  const { email, code, newPassword } = req.body || {};
  await newPasswordLogic(email, code, newPassword);

  success(res, 200, undefined, "密碼更新成功");
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

  success(res, 200, undefined, "成功登出");
};

//access過期替換
export const refresh: AsyncFunction = async (req, res) => {
  const deviceId = req.cookies.deviceId;
  const refreshToken = req.cookies.refreshToken;
  const { newPayload, newRefreshToken } = await refreshTokenLogic(
    refreshToken,
    deviceId,
  );

  //建立新access token
  const accessToken = createAccessToken({
    id: newPayload.id,
    userName: newPayload.userName,
    deviceId: newPayload.deviceId,
    email: newPayload.email,
    role: newPayload.role,
  });

  //設置新cookies refresh token
  if (newRefreshToken) {
    cookiesFn(res, newRefreshToken);
  }

  success(res, 200, { accessToken }, "成功替換");
};
