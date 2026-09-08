import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { createCourse, getCourse } from "../controllers/course_controller";
import { upload } from "../middlewares/upload";
import { courseSchema } from "../validation/schemas/course.schema";

export const course_router = express.Router();

course_router.use(authMiddleware);

openapiRoute({
  method: "post",
  path: "/createCourse",
  tags: ["Profile"],
  needAuth: true,
  summary: "建立線上課程",
  formData: true,
  middlewares: [upload.single("image")],
  schema: courseSchema,
  handler: [asyncHandler(createCourse)],
  router: course_router,
});

openapiRoute({
  method: "get",
  path: "/getCourse",
  tags: ["Course"],
  needAuth: true,
  summary: "所有線上課程",
  handler: [asyncHandler(getCourse)],
  router: course_router,
});
