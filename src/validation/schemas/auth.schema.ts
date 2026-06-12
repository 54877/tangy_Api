import { z } from "../../config/zod";
import { passwordScheme, userNameScheme } from "../rules/auth.rule";
import { easyPassword } from "../contexts/aurh.common.schema";

export const registerSchema = z.object({
  password: passwordScheme,
  user_name: userNameScheme,
  email: z.string("請輸入字串").trim().email("請輸入正確email格式"),
});

export const loginSchema = z.object({
  email: z.string("請輸入字串").trim().email("請輸入正確email格式"),
  password: easyPassword,
});

export const forgotSchema = z.object({
  email: z.string("請輸入字串").trim().email("請輸入正確email格式"),
});
