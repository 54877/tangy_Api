import express from "express";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middlewares/auth";
import {
  createTag,
  deleteCourse,
  deleteTag,
  editTag,
  editUserRole,
  getAllTags,
  getAllUsers,
} from "../controllers/backstage_controllers";
import {
  EditTagSchema,
  TagSchema,
} from "../validation/schemas/backstage.schema";
import { IdSchema } from "../validation/schemas/common.schema";

export const backStage_router = express.Router();

backStage_router.use(authMiddleware);

openapiRoute({
  method: "get",
  path: "/getAllTags",
  tags: ["backStage"],
  needAuth: true,
  summary: "標籤列表",
  handler: [asyncHandler(getAllTags)],
  router: backStage_router,
});

openapiRoute({
  method: "post",
  path: "/createTag",
  tags: ["backStage"],
  needAuth: true,
  summary: "建立標籤",
  schema: TagSchema,
  handler: [asyncHandler(createTag)],
  router: backStage_router,
});

openapiRoute({
  method: "delete",
  path: "/deleteTag",
  tags: ["backStage"],
  needAuth: true,
  summary: "刪除標籤",
  schema: IdSchema,
  handler: [asyncHandler(deleteTag)],
  router: backStage_router,
});

openapiRoute({
  method: "put",
  path: "/editTag",
  tags: ["backStage"],
  needAuth: true,
  summary: "編輯標籤",
  schema: EditTagSchema,
  handler: [asyncHandler(editTag)],
  router: backStage_router,
});

openapiRoute({
  method: "delete",
  path: "/deleteCourse",
  tags: ["backStage"],
  needAuth: true,
  summary: "刪除課程",
  schema: IdSchema,
  handler: [asyncHandler(deleteCourse)],
  router: backStage_router,
});

openapiRoute({
  method: "get",
  path: "/getAllUsers",
  tags: ["backStage"],
  needAuth: true,
  summary: "使用者資料列表",
  handler: [asyncHandler(getAllUsers)],
  router: backStage_router,
});

//修改user權限
openapiRoute({
  method: "post",
  path: "/editUserRole",
  tags: ["backStage"],
  needAuth: true,
  summary: "修改使用者權限",
  schema: IdSchema,
  handler: [asyncHandler(editUserRole)],
  router: backStage_router,
});

//審核課程 -> 新增完畢後建立課程的db需要跟者修改 ()
