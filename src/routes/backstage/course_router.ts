import express from "express";
import { openapiRoute } from "../../utils/openapiRoute";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  deleteCourse,
  getAdminCourseById,
  getCoursesForAdmin,
  reviewCourse,
} from "../../controllers/backstage/course_controller";
import { UuidIdSchema } from "../../validation/schemas/common.schema";
import { reviewCourseSchema } from "../../validation/schemas/backstage/course.schema";

export const backStageCourseRouter = express.Router();

openapiRoute({
  method: "get",
  path: "/getCourseAdmin",
  tags: ["backStage"],
  needAuth: true,
  summary: "課程資料列表",
  handler: [asyncHandler(getCoursesForAdmin)],
  router: backStageCourseRouter,
});

openapiRoute({
  method: "post",
  path: "/getCourseById",
  tags: ["backStage"],
  needAuth: true,
  summary: "單筆課程資料",
  schema: UuidIdSchema,
  handler: [asyncHandler(getAdminCourseById)],
  router: backStageCourseRouter,
});

openapiRoute({
  method: "delete",
  path: "/deleteCourse",
  tags: ["backStage"],
  needAuth: true,
  summary: "刪除課程",
  schema: UuidIdSchema,
  handler: [asyncHandler(deleteCourse)],
  router: backStageCourseRouter,
});

openapiRoute({
  method: "put",
  path: "/reviewCourse",
  tags: ["backStage"],
  needAuth: true,
  summary: "審核課程",
  schema: reviewCourseSchema,
  handler: [asyncHandler(reviewCourse)],
  router: backStageCourseRouter,
});
