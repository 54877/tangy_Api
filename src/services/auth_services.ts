import bcrypt from "bcrypt";
import { TokenType, UserType } from "../types/authType";
import {
  codeCountDb,
  createEmailVerification,
  expiredCodeDb,
  logoutDb,
  newPasswordDb,
  refreshTokenChange,
  refreshTokenDb,
  registerUserDb,
  storedTokenDb,
  userDb,
  verifyDb,
} from "../repository/userRepository";
import jwt from "jsonwebtoken";
import crypto, { randomInt } from "node:crypto";
import { AppError } from "../utils/errors";
import {
  createAccessToken,
  createRefreshToken,
  TokenPayload,
} from "../utils/jwt";
import { Resend } from "resend";

const userEmail = async (
  email: string,
  ErrorMessage: string,
  field?: string,
) => {
  const user = await userDb(email);
  if (!user) {
    throw new AppError(ErrorMessage, 400, field);
  }
  return user;
};

const hash = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const resend = new Resend(process.env.RESEND_API_KEY);

//註冊
export const registerUserLogic = async ({
  password,
  userName,
  email,
}: UserType) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await registerUserDb({
    password: hashPassword,
    userName,
    email,
  });
  return result;
};

//登入
export const loginUserLogic = async ({
  email,
  password,
  userAgent,
  ip,
}: TokenType) => {
  const user = await userEmail(email, "帳密有誤");
  const psd = await bcrypt.compare(password, user.password);
  const userDate = {
    id: user.id,
    email: user.email,
    role: user.role,
  } as TokenPayload;
  if (!psd) {
    throw new AppError("帳密有誤", 400);
  }
  const accessToken = createAccessToken(userDate);

  const refreshToken = createRefreshToken(userDate);

  const tokenHash = hash(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const absoluteExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  await refreshTokenDb(
    tokenHash,
    user.id,
    userAgent,
    ip,
    expiresAt,
    absoluteExpiresAt,
  );

  return {
    accessToken,
    refreshToken,
    userDate,
  };
};

//登出
export const logoutLogic = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError("未登入", 401);
  }

  const tokenHash = hash(refreshToken);
  await logoutDb(tokenHash);
};

//Refresh token
export const refreshTokenLogic = async (
  token: string | null,
  userAgent: string,
  ip: string,
) => {
  if (!token) {
    throw new AppError("未登入", 401);
  }

  const payload = jwt.verify(
    token,
    process.env.REFRESH_SECRET!,
  ) as TokenPayload;

  //查詢使用者 若有修改使用者則可以立即更新
  const user = await userEmail(payload.email, "帳密有誤");
  const newPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  } as TokenPayload;

  const tokenHash = hash(token);

  const storedToken = await storedTokenDb(tokenHash);
  if (!storedToken) {
    throw new AppError("Refresh Token 無效", 401);
  }

  if (storedToken.revokedAt !== null) {
    throw new AppError("Refresh Token 已失效", 401);
  }

  // 判斷是否過期
  if (storedToken.expiresAt < new Date()) {
    await logoutDb(tokenHash);
    throw new AppError("Refresh Token 過期", 401);
  }

  // 判斷是否超過最大滑動時間
  if (storedToken.absoluteExpiresAt < new Date()) {
    await logoutDb(tokenHash);
    throw new AppError("Refresh Token 過期", 401);
  }

  //建立新refresh token
  const newRefreshToken = createRefreshToken(newPayload);

  const newHashToken = hash(newRefreshToken);
  let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const absoluteExpiresAt = storedToken.absoluteExpiresAt;
  if (absoluteExpiresAt < expiresAt) {
    expiresAt = absoluteExpiresAt;
  }

  //移除舊refresh token 建立新 refresh token
  await refreshTokenChange(
    tokenHash,
    newHashToken,
    storedToken.userId,
    userAgent,
    ip,
    expiresAt,
    absoluteExpiresAt,
  );

  return { newPayload, newRefreshToken };
};

//驗證碼寄信
export const sendEmail = async (email: string) => {
  const user = await userEmail(email, "查無此信箱", "email");

  const code = randomInt(100000, 1000000).toString();
  await createEmailVerification(code, email);

  return await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "驗證碼",
    html: `<p>你的驗證碼是：<b>${code}</b></p>`,
  });
};

//忘記密碼流程
export const newPasswordLogic = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  //驗證 驗證碼
  const record = await verifyDb(email);
  if (!record) {
    throw new AppError("驗證失敗", 400, "email");
  }

  if (record.expiresAt <= new Date()) {
    await expiredCodeDb(email);
    throw new AppError("驗證碼已過期", 400, "code");
  }

  if (record.count >= 5) {
    await expiredCodeDb(email);
    throw new AppError("嘗試次數過多，請重新取得驗證碼", 429, "code");
  }

  if (record.code !== code) {
    await codeCountDb(email);
    throw new AppError("驗證碼錯誤", 400, "code");
  }

  //驗證密碼是否與舊密碼相同
  const user = await userEmail(email, "驗證失敗", "email");
  const psd = await bcrypt.compare(newPassword, user.password);
  if (psd) {
    throw new AppError("新舊密碼不可相同", 400, "newPassword");
  }

  //更新密碼 & 刪除 驗證資料
  const hashPassword = await bcrypt.hash(newPassword, 10);
  const result = await newPasswordDb(email, hashPassword);
  return result;
};
