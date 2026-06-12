import bcrypt from "bcrypt";
import { user } from "../types/authType";
import { registerUserDb, userDb } from "../repository/userRepository";
import { AppError } from "../utils/errors";
import { generateAccessToken } from "../utils/jwt";

export const registerUserLogic = async ({
  password,
  user_name,
  email,
}: user) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await registerUserDb({
    password: hashPassword,
    user_name,
    email,
  });
  return result;
};

export const loginUserLogic = async ({
  email,
  password,
}: Omit<user, "user_name">) => {
  const user = await userDb(email);

  if (!user) {
    throw new AppError("帳號不存在", 400);
  }
  const psd = await bcrypt.compare(password, user.password);
  if (!psd) {
    throw new AppError("密碼錯誤", 400);
  }
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    //TODO 後續須改回依照USER判斷
    role: "admin",
  });

  return accessToken;
};
