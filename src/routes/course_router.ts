import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createCourse,
  createCourseVideo,
  getCourse,
} from "../controllers/course_controller";
import { upload, videoUpload } from "../middlewares/upload";
import {
  courseSchema,
  createCourseVideoOpenapiSchema,
} from "../validation/schemas/course.schema";
import { imageUploadType, videoUploadType } from "../utils/errors";
import { createImageSchema } from "../validation/utils/imageSchema";

export const course_router = express.Router();

openapiRoute({
  method: "get",
  path: "/getCourse",
  tags: ["Course"],
  needAuth: true,
  summary: "所有線上課程",
  handler: [asyncHandler(getCourse)],
  router: course_router,
});

course_router.use(authMiddleware);

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
  router: course_router,
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
  router: course_router,
});
