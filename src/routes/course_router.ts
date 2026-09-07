import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { createCourse } from "../controllers/course_controller";
import { upload } from "../middlewares/upload";

export const course_router = express.Router();

course_router.use(authMiddleware);

openapiRoute({
  method: "get",
  path: "/createCourse",
  tags: ["Course"],
  needAuth: true,
  summary: "建立線上課程",
  formData: true,
  middlewares: [upload.single("image")],
  //   schema: personalSchema,
  handler: [asyncHandler(createCourse)],
  router: course_router,
});
