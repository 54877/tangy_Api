import z from "zod";
import { accountScheme, passwordScheme, userNameScheme } from "./common.schema";

export const registerSchema = z.object({
  account: accountScheme,
  password: passwordScheme,
  user_name: userNameScheme,
});
