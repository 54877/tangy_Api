import bcrypt from "bcrypt";
import { user } from "../types/authType";
import { registerUserDb } from "../repository/userRepository";

export const registerUserLogic = async ({
  account,
  password,
  user_name,
}: user) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await registerUserDb({
    account,
    password: hashPassword,
    user_name,
  });
  return result;
};
