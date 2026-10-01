import express from "express";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middlewares/auth";
import {
  createTag,
  deleteTag,
  editTag,
} from "../controllers/backstage_controllers";
import {
  EditTagSchema,
  TagIdSchema,
  TagSchema,
} from "../validation/schemas/backstage.schema";

export const backStage_router = express.Router();

backStage_router.use(authMiddleware);

openapiRoute({
  method: "post",
  path: "/createTag",
  tags: ["後台"],
  needAuth: true,
  summary: "建立標籤",
  schema: TagSchema,
  handler: [asyncHandler(createTag)],
  router: backStage_router,
});

openapiRoute({
  method: "post",
  path: "/deleteTag",
  tags: ["後台"],
  needAuth: true,
  summary: "刪除標籤",
  schema: TagIdSchema,
  handler: [asyncHandler(deleteTag)],
  router: backStage_router,
});

openapiRoute({
  method: "put",
  path: "/editTag",
  tags: ["後台"],
  needAuth: true,
  summary: "編輯標籤",
  schema: EditTagSchema,
  handler: [asyncHandler(editTag)],
  router: backStage_router,
});
