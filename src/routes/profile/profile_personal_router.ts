import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import {
  deviceCloseByIdControllers,
  deviceCloseByUserIdControllers,
  getPersonal,
  sendSVEmailControllers,
  svCloseControllers,
  svControllers,
  updatePassword,
  updatePersonal,
  updateUserImage,
} from "../../controllers/profile/profile_personal_controller";
import { upload } from "../../middlewares/upload";
import { asyncHandler } from "../../utils/asyncHandler";
import { imageUploadType } from "../../utils/errors";
import { openapiRoute } from "../../utils/openapiRoute";
import {
  svEmail,
  svOpen,
  updatePasswordScheme,
} from "../../validation/schemas/profile.schema";
import { createImageSchema } from "../../validation/utils/imageSchema";
import {
  UuidIdSchema,
  UuidUserIdSchema,
} from "../../validation/schemas/common.schema";

export const profilePersonalRouter = express.Router();

profilePersonalRouter.use(authMiddleware);

openapiRoute({
  method: "get",
  path: "/personal",
  tags: ["Profile"],
  needAuth: true,
  summary: "個人資料",
  handler: [asyncHandler(getPersonal)],
  router: profilePersonalRouter,
});

openapiRoute({
  method: "put",
  path: "/updatePersonal",
  tags: ["Profile"],
  needAuth: true,
  summary: "更新個人資料",
  formData: true,
  handler: [asyncHandler(updatePersonal)],
  router: profilePersonalRouter,
});

openapiRoute({
  method: "put",
  path: "/updateUserImage",
  tags: ["Profile"],
  needAuth: true,
  summary: "更新個人照片",
  formData: true,
  middlewares: [imageUploadType, upload.single("image")],
  openapiSchema: createImageSchema(),
  handler: [asyncHandler(updateUserImage)],
  router: profilePersonalRouter,
});

openapiRoute({
  method: "put",
  path: "/updatePassword",
  tags: ["Profile"],
  needAuth: true,
  schema: updatePasswordScheme,
  summary: "更新密碼(已登入)",
  handler: [asyncHandler(updatePassword)],
  router: profilePersonalRouter,
});

openapiRoute({
  method: "post",
  path: "/SvSendEmail",
  tags: ["Profile"],
  needAuth: true,
  summary: "sv寄信驗證",
  schema: svEmail,
  handler: [asyncHandler(sendSVEmailControllers)],
  router: profilePersonalRouter,
});

openapiRoute({
  method: "post",
  path: "/2FA",
  tags: ["Profile"],
  needAuth: true,
  summary: "開啟2FA",
  schema: svOpen,
  handler: [asyncHandler(svControllers)],
  router: profilePersonalRouter,
});

openapiRoute({
  method: "post",
  path: "/2FAClose",
  tags: ["Profile"],
  needAuth: true,
  summary: "關閉2FA",
  handler: [asyncHandler(svCloseControllers)],
  router: profilePersonalRouter,
});

openapiRoute({
  method: "post",
  path: "/DeviceCloseById",
  tags: ["Profile"],
  needAuth: true,
  schema: UuidIdSchema,
  summary: "登出裝置",
  handler: [asyncHandler(deviceCloseByIdControllers)],
  router: profilePersonalRouter,
});

openapiRoute({
  method: "post",
  path: "/DeviceCloseByUserId",
  tags: ["Profile"],
  needAuth: true,
  schema: UuidUserIdSchema,
  summary: "登出所有裝置",
  handler: [asyncHandler(deviceCloseByUserIdControllers)],
  router: profilePersonalRouter,
});

