import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import { createCourse, createCourseVideo } from "../../controllers/course_controller";
import { getCourseFormOptions } from "../../controllers/profile/profile_course_controller";
import { upload, videoUpload } from "../../middlewares/upload";
import { asyncHandler } from "../../utils/asyncHandler";
import { imageUploadType, videoUploadType } from "../../utils/errors";
import { openapiRoute } from "../../utils/openapiRoute";
import {
  courseSchema,
  createCourseVideoOpenapiSchema,
} from "../../validation/schemas/course.schema";
import { createImageSchema } from "../../validation/utils/imageSchema";

export const profileCourseRouter = express.Router();

profileCourseRouter.use(authMiddleware);

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
  summary: "建立線上課程-影片",
  formData: true,
  openapiSchema: createCourseVideoOpenapiSchema,
  middlewares: [videoUploadType, videoUpload.single("video")],
  handler: [asyncHandler(createCourseVideo)],
  router: profileCourseRouter,
});
