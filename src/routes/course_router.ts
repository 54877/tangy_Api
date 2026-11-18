import express from "express";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { getCourse, searchCourse } from "../controllers/course_controller";
import { searchCourseSchema } from "../validation/schemas/course.schema";

export const course_router = express.Router();

openapiRoute({
  method: "get",
  path: "/getCourse",
  tags: ["Course"],
  summary: "所有線上課程",
  handler: [asyncHandler(getCourse)],
  router: course_router,
});

openapiRoute({
  method: "post",
  path: "/searchCourse",
  tags: ["Course"],
  summary: "搜尋線上課程",
  schema: searchCourseSchema,
  handler: [asyncHandler(searchCourse)],
  router: course_router,
});
