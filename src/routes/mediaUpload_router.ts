import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { getToken } from "../controllers/mediaUpload_controller";
import { getUploadTokenSchema } from "../validation/schemas/mediaUpload.schena";

export const mediaUploadRouter = express.Router();

// 媒體直傳雲端相關 API 需先登入。
mediaUploadRouter.use(authMiddleware);

openapiRoute({
  method: "post",
  path: "/getUploadToken",
  tags: ["檔案"],
  needAuth: true,
  summary: "取得授權",
  schema: getUploadTokenSchema,
  handler: [asyncHandler(getToken)],
  router: mediaUploadRouter,
});
