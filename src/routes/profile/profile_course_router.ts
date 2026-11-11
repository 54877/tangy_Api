import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import { userRateLimit } from "../../middlewares/userRateLimit";
import {
  createCourse,
  createCourseVideo,
} from "../../controllers/course_controller";
import {
  getMyCourseDetailById,
  getCourseFormOptions,
  getMyCourse,
  reReviewMyCourse,
} from "../../controllers/profile/profile_course_controller";
import { upload, videoUpload } from "../../middlewares/upload";
import { asyncHandler } from "../../utils/asyncHandler";
import { imageUploadType, videoUploadType } from "../../utils/errors";
import { openapiRoute } from "../../utils/openapiRoute";
import {
  courseSchema,
  createCourseVideoOpenapiSchema,
  reReviewCourseBaseSchema,
  reReviewCourseSchema,
} from "../../validation/schemas/course.schema";
import { UuidIdSchema } from "../../validation/schemas/common.schema";
import {
  createImageSchema,
  createImageSchemaOptional,
} from "../../validation/utils/imageSchema";

export const profileCourseRouter = express.Router();

profileCourseRouter.use(authMiddleware);

openapiRoute({
  method: "post",
  path: "/getMyCourseById",
  tags: ["Profile"],
  needAuth: true,
  summary: "取得我的課程單筆詳細資料",
  schema: UuidIdSchema,
  handler: [asyncHandler(getMyCourseDetailById)],
  router: profileCourseRouter,
});

openapiRoute({
  method: "put",
  path: "/reReviewCourse",
  tags: ["Profile"],
  needAuth: true,
  summary: "重新送審課程",
  formData: true,
  middlewares: [
    userRateLimit(3_000, 1),
    imageUploadType,
    upload.single("image"),
  ],
  schema: reReviewCourseSchema,
  openapiSchema: createImageSchemaOptional(reReviewCourseBaseSchema),
  handler: [asyncHandler(reReviewMyCourse)],
  router: profileCourseRouter,
});

openapiRoute({
  method: "get",
  path: "/myCourse",
  tags: ["Profile"],
  needAuth: true,
  summary: "取得我的課程列表",
  handler: [asyncHandler(getMyCourse)],
  router: profileCourseRouter,
});

openapiRoute({
  method: "get",
  path: "/getCourseFormOptions",
  tags: ["Profile"],
  needAuth: true,
  summary: "標籤與課程分類",
  handler: [asyncHandler(getCourseFormOptions)],
  router: profileCourseRouter,
});

openapiRoute({
  method: "post",
  path: "/createCourse",
  tags: ["Profile"],
  needAuth: true,
  summary: "建立線上課程",
  formData: true,
  middlewares: [imageUploadType, upload.single("image")],
  schema: courseSchema,
  openapiSchema: createImageSchema(courseSchema),
  handler: [asyncHandler(createCourse)],
  router: profileCourseRouter,
});

openapiRoute({
  method: "post",
  path: "/createCourseVideo",
  tags: ["Profile"],
  needAuth: true,
  summary: "建立(審核)線上課程-影片",
  formData: true,
  openapiSchema: createCourseVideoOpenapiSchema,
  middlewares: [videoUploadType, videoUpload.single("video")],
  handler: [asyncHandler(createCourseVideo)],
  router: profileCourseRouter,
});
