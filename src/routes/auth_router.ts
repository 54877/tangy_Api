import express from "express";
import {
  loginUser,
  logoutControllers,
  newPassword,
  refresh,
  registerUser,
  sendEmailControllers,
} from "../controllers/auth_controllers";

import {
  forgotSchema,
  loginSchema,
  newPasswordSchema,
  registerSchema,
} from "../validation/schemas/auth.schema";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";

export const auth_router = express.Router();

openapiRoute({
  method: "post",
  path: "/register",
  tags: ["Auth"],
  summary: "註冊帳號",
  schema: registerSchema,
  handler: [asyncHandler(registerUser)],
  router: auth_router,
});

openapiRoute({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  summary: "登入帳號",
  schema: loginSchema,
  handler: [asyncHandler(loginUser)],
  router: auth_router,
});

openapiRoute({
  method: "post",
  path: "/forgotPassword",
  tags: ["Auth"],
  summary: "忘記密碼 - 寄驗證信",
  schema: forgotSchema,
  handler: [asyncHandler(sendEmailControllers)],
  router: auth_router,
});

openapiRoute({
  method: "put",
  path: "/resetPassword",
  tags: ["Auth"],
  summary: "更新密碼",
  schema: newPasswordSchema,
  handler: [asyncHandler(newPassword)],
  router: auth_router,
});

openapiRoute({
  method: "post",
  path: "/logout",
  tags: ["Auth"],
  summary: "登出",
  handler: [asyncHandler(logoutControllers)],
  router: auth_router,
});

openapiRoute({
  method: "post",
  path: "/refresh",
  tags: ["Auth"],
  summary: "accessToken替換",
  handler: [asyncHandler(refresh)],
  router: auth_router,
});
