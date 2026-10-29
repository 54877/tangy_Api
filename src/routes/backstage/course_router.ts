import express from "express";
import { openapiRoute } from "../../utils/openapiRoute";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  deleteCourse,
  getAllCoursesForAdmin,
  reviewCourse,
} from "../../controllers/backstage/course_controller";
import { IdSchema } from "../../validation/schemas/common.schema";

export const backStageCourseRouter = express.Router();

openapiRoute({
  method: "get",
  path: "/getCourseAdmin",
  tags: ["backStage"],
  needAuth: true,
  summary: "取得完整課程資料",
  handler: [asyncHandler(getAllCoursesForAdmin)],
  router: backStageCourseRouter,
});

openapiRoute({
  method: "delete",
  path: "/deleteCourse",
  tags: ["backStage"],
  needAuth: true,
  summary: "刪除課程",
  schema: IdSchema,
  handler: [asyncHandler(deleteCourse)],
  router: backStageCourseRouter,
});

openapiRoute({
  method: "put",
  path: "/reviewCourse",
  tags: ["backStage"],
  needAuth: true,
  summary: "審核課程",
  schema: IdSchema,
  handler: [asyncHandler(reviewCourse)],
  router: backStageCourseRouter,
});
