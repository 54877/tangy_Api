import { z } from "../../config/zod";
import {
  codeScheme,
  email,
  passwordScheme,
  userNameScheme,
} from "../rules/auth.rule";
import {
  birthdayScheme,
  genderScheme,
  introductionScheme,
} from "../rules/profile.rule";

export const personalSchema = z.object({
  userName: userNameScheme,
  gender: genderScheme,
  introduction: introductionScheme,
  birthday: birthdayScheme,
});

export const updatePasswordScheme = z.object({
  newPassword: passwordScheme("strong"),
  oldPassword: passwordScheme("weak"),
});

export const svEmail = z.object({
  email: email,
});

export const svOpen = z.object({
  email: email,
  code: codeScheme,
});
