import express from "express";
import {
  deviceCloseByIdControllers,
  getPersonal,
  sendSVEmailControllers,
  svCloseControllers,
  svControllers,
  updatePassword,
  updatePersonal,
} from "../controllers/profile_controllers";
import { authMiddleware } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { openapiRoute } from "../utils/openapiRoute";
import {
  personalSchema,
  svEmail,
  svOpen,
  updatePasswordScheme,
} from "../validation/schemas/profile.schema";

export const profile_router = express.Router();

profile_router.use(authMiddleware);

openapiRoute({
  method: "get",
  path: "/personal",
  tags: ["Profile"],
  needAuth: true,
  summary: "個人資料",
  handler: [asyncHandler(getPersonal)],
  router: profile_router,
});

openapiRoute({
  method: "put",
  path: "/updatePersonal",
  tags: ["Profile"],
  needAuth: true,
  summary: "更新個人資料",
  schema: personalSchema,
  handler: [asyncHandler(updatePersonal)],
  router: profile_router,
});

openapiRoute({
  method: "put",
  path: "/updatePassword",
  tags: ["Profile"],
  needAuth: true,
  schema: updatePasswordScheme,
  summary: "更新密碼(已登入)",
  handler: [asyncHandler(updatePassword)],
  router: profile_router,
});

openapiRoute({
  method: "post",
  path: "/SvSendEmail",
  tags: ["Profile"],
  needAuth: true,
  summary: "sv寄信驗證",
  schema: svEmail,
  handler: [asyncHandler(sendSVEmailControllers)],
  router: profile_router,
});

openapiRoute({
  method: "post",
  path: "/2FA",
  tags: ["Profile"],
  needAuth: true,
  summary: "開啟2FA",
  schema: svOpen,
  handler: [asyncHandler(svControllers)],
  router: profile_router,
});

openapiRoute({
  method: "post",
  path: "/2FAClose",
  tags: ["Profile"],
  needAuth: true,
  summary: "關閉2FA",
  handler: [asyncHandler(svCloseControllers)],
  router: profile_router,
});

openapiRoute({
  method: "post",
  path: "/DeviceCloseById",
  tags: ["Profile"],
  needAuth: true,
  summary: "登出裝置",
  handler: [asyncHandler(deviceCloseByIdControllers)],
  router: profile_router,
});
