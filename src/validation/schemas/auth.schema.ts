import { z } from "../../config/zod";
import {
  codeScheme,
  email,
  passwordScheme,
  userNameScheme,
} from "../rules/auth.rule";

export const registerSchema = z.object({
  email: email,
  password: passwordScheme("strong"),
  userName: userNameScheme,
});

export const loginSchema = z.object({
  email: email,
  password: passwordScheme("weak"),
});

export const forgotSchema = z.object({
  email: email,
});

export const verifySchema = z.object({
  email: email,
  code: codeScheme,
});

export const newPasswordSchema = z.object({
  email: email,
  code: codeScheme,
  password: passwordScheme("strong"),
});
