import bcrypt from "bcrypt";
import { UserType } from "../types/authType";
import {
  codeCountDb,
  createEmailVerification,
  expiredCodeDb,
  newPasswordDb,
  registerUserDb,
  userDb,
  verifyDb,
} from "../repository/userRepository";
import { AppError } from "../utils/errors";
import { generateAccessToken } from "../utils/jwt";
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
}: Omit<UserType, "userName">) => {
  const user = await userEmail(email, "帳密有誤");
  const psd = await bcrypt.compare(password, user.password);
  if (!psd) {
    throw new AppError("帳密有誤", 400);
  }
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    //TODO 後續須改回依照USER判斷
    role: "admin",
  });

  return accessToken;
};

const resend = new Resend(process.env.RESEND_API_KEY);

//驗證碼寄信
export const sendEmail = async (email: string) => {
  const user = await userEmail(email, "無效請求", "email");

  const code = String(Math.floor(100000 + Math.random() * 900000));
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

  if (record.expires_at <= new Date()) {
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
