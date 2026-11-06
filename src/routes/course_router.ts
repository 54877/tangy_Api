import express from "express";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { getCourse } from "../controllers/course_controller";

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

