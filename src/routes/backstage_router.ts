import express from "express";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middlewares/auth";
import {
  createTag,
  deleteCourse,
  deleteTag,
  editTag,
} from "../controllers/backstage_controllers";
import {
  EditTagSchema,
  TagSchema,
} from "../validation/schemas/backstage.schema";
import { IdSchema } from "../validation/schemas/common.schema";

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
  method: "delete",
  path: "/deleteTag",
  tags: ["後台"],
  needAuth: true,
  summary: "刪除標籤",
  schema: IdSchema,
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

//刪除課程
openapiRoute({
  method: "delete",
  path: "/deleteCourse",
  tags: ["後台"],
  needAuth: true,
  summary: "刪除課程",
  schema: IdSchema,
  handler: [asyncHandler(deleteCourse)],
  router: backStage_router,
});

//讀取所有user資料(帳號、權限)
//修改user權限
//審核課程 -> 新增完畢後建立課程的db需要跟者修改
