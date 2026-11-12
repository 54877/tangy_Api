import express from "express";
import { openapiRoute } from "../../utils/openapiRoute";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createCourseCategory,
  deleteCourseCategory,
  editCourseCategory,
  getAllCourseCategories,
} from "../../controllers/backstage/backStage_category_controller";
import {
  CourseCategorySchema,
  DeleteCourseCategorySchema,
  EditCourseCategorySchema,
} from "../../validation/schemas/backstage/backStage_category.schema";

export const backStageCategoryRouter = express.Router();

openapiRoute({
  method: "get",
  path: "/getAllCourseCategories",
  tags: ["Backstage / Categories"],
  needAuth: true,
  summary: "課程分類列表",
  handler: [asyncHandler(getAllCourseCategories)],
  router: backStageCategoryRouter,
});

openapiRoute({
  method: "post",
  path: "/createCourseCategory",
  tags: ["Backstage / Categories"],
  needAuth: true,
  summary: "建立課程分類",
  schema: CourseCategorySchema,
  handler: [asyncHandler(createCourseCategory)],
  router: backStageCategoryRouter,
});

openapiRoute({
  method: "put",
  path: "/editCourseCategory",
  tags: ["Backstage / Categories"],
  needAuth: true,
  summary: "編輯課程分類",
  schema: EditCourseCategorySchema,
  handler: [asyncHandler(editCourseCategory)],
  router: backStageCategoryRouter,
});

openapiRoute({
  method: "delete",
  path: "/deleteCourseCategory",
  tags: ["Backstage / Categories"],
  needAuth: true,
  summary: "刪除課程分類",
  schema: DeleteCourseCategorySchema,
  handler: [asyncHandler(deleteCourseCategory)],
  router: backStageCategoryRouter,
});
