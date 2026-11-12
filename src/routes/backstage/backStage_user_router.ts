import express from "express";
import { openapiRoute } from "../../utils/openapiRoute";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  editUserRole,
  getAllUsers,
} from "../../controllers/backstage/backStage_user_controller";
import { UuidIdSchema } from "../../validation/schemas/common.schema";

export const backStageUserRouter = express.Router();

openapiRoute({
  method: "get",
  path: "/getAllUsers",
  tags: ["Backstage / Users"],
  needAuth: true,
  summary: "使用者資料列表",
  handler: [asyncHandler(getAllUsers)],
  router: backStageUserRouter,
});

openapiRoute({
  method: "post",
  path: "/editUserRole",
  tags: ["Backstage / Users"],
  needAuth: true,
  summary: "修改使用者權限",
  schema: UuidIdSchema,
  handler: [asyncHandler(editUserRole)],
  router: backStageUserRouter,
});
