import express from "express";
import {
  getPersonal,
  updatePassword,
  updatePersonal,
} from "../controllers/profile_controllers";
import { authMiddleware } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { openapiRoute } from "../utils/openapiRoute";
import {
  personalSchema,
  updatePasswordScheme,
} from "../validation/schemas/profile.schema";
import { forgotSchema } from "../validation/schemas/auth.schema";
import { sendEmailControllers } from "../controllers/auth_controllers";

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
  tags: ["Auth"],
  needAuth: true,
  summary: "sv寄信驗證",
  schema: forgotSchema,
  handler: [asyncHandler(sendEmailControllers)],
  router: profile_router,
});
