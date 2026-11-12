import express from "express";
import { openapiRoute } from "../../utils/openapiRoute";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createTag,
  deleteTag,
  editTag,
  getAllTags,
} from "../../controllers/backstage/backStage_tag_controller";
import {
  EditTagSchema,
  TagSchema,
} from "../../validation/schemas/backstage/backStage_tag.schema";
import { KeySchema } from "../../validation/schemas/common.schema";

export const backStageTagRouter = express.Router();

openapiRoute({
  method: "get",
  path: "/getAllTags",
  tags: ["Backstage / Tags"],
  needAuth: true,
  summary: "標籤列表",
  handler: [asyncHandler(getAllTags)],
  router: backStageTagRouter,
});

openapiRoute({
  method: "post",
  path: "/createTag",
  tags: ["Backstage / Tags"],
  needAuth: true,
  summary: "建立標籤",
  schema: TagSchema,
  handler: [asyncHandler(createTag)],
  router: backStageTagRouter,
});

openapiRoute({
  method: "delete",
  path: "/deleteTag",
  tags: ["Backstage / Tags"],
  needAuth: true,
  summary: "刪除標籤",
  schema: KeySchema,
  handler: [asyncHandler(deleteTag)],
  router: backStageTagRouter,
});

openapiRoute({
  method: "put",
  path: "/editTag",
  tags: ["Backstage / Tags"],
  needAuth: true,
  summary: "編輯標籤",
  schema: EditTagSchema,
  handler: [asyncHandler(editTag)],
  router: backStageTagRouter,
});
