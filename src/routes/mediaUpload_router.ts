import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { checkComplete, getToken } from "../controllers/mediaUpload_controller";
import {
  completeMediaUploadSchema,
  getUploadTokenSchema,
} from "../validation/schemas/mediaUpload.schena";

export const mediaUploadRouter = express.Router();

mediaUploadRouter.use(authMiddleware);

openapiRoute({
  method: "post",
  path: "/getUploadToken",
  tags: ["file"],
  needAuth: true,
  summary: "取得授權",
  schema: getUploadTokenSchema,
  handler: [asyncHandler(getToken)],
  router: mediaUploadRouter,
});

openapiRoute({
  method: "post",
  path: "/completeMediaUpload",
  tags: ["file"],
  needAuth: true,
  summary: "完成上傳確認",
  schema: completeMediaUploadSchema,
  handler: [asyncHandler(checkComplete)],
  router: mediaUploadRouter,
});
