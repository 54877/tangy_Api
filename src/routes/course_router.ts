import express from "express";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { searchCourse } from "../controllers/course_controller";
import { searchCourseSchema } from "../validation/schemas/course.schema";

export const course_router = express.Router();

openapiRoute({
  method: "post",
  path: "/searchCourse",
  tags: ["Course"],
  summary: "搜尋線上課程",
  schema: searchCourseSchema,
  handler: [asyncHandler(searchCourse)],
  router: course_router,
});
