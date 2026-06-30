import express from "express";
import {
  forgotPassword,
  loginUser,
  newPassword,
  registerUser,
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
  path: "/forgot",
  tags: ["Auth"],
  summary: "忘記密碼",
  schema: forgotSchema,
  handler: [asyncHandler(forgotPassword)],
  router: auth_router,
});

openapiRoute({
  method: "put",
  path: "/verify",
  tags: ["Auth"],
  summary: "更新密碼",
  schema: newPasswordSchema,
  handler: [asyncHandler(newPassword)],
  router: auth_router,
});
