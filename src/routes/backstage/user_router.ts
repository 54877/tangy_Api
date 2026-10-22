import express from "express";
import { openapiRoute } from "../../utils/openapiRoute";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  editUserRole,
  getAllUsers,
} from "../../controllers/backstage/user_controller";
import { IdSchema } from "../../validation/schemas/common.schema";

export const backStageUserRouter = express.Router();

openapiRoute({
  method: "get",
  path: "/getAllUsers",
  tags: ["backStage"],
  needAuth: true,
  summary: "使用者資料列表",
  handler: [asyncHandler(getAllUsers)],
  router: backStageUserRouter,
});

openapiRoute({
  method: "post",
  path: "/editUserRole",
  tags: ["backStage"],
  needAuth: true,
  summary: "修改使用者權限",
  schema: IdSchema,
  handler: [asyncHandler(editUserRole)],
  router: backStageUserRouter,
});
