import { z } from "../../config/zod";
import { email, passwordScheme, userNameScheme } from "../rules/auth.rule";

export const registerSchema = z.object({
  email: email,
  password: passwordScheme("strong"),
  user_name: userNameScheme,
});

export const loginSchema = z.object({
  email: email,
  password: passwordScheme("weak"),
});

export const forgotSchema = z.object({
  email: email,
});
