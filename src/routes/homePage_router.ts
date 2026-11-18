import express from "express";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { getHomepageCourse } from "../controllers/homePage_controller";

export const homePage_router = express.Router();

openapiRoute({
  method: "get",
  path: "/homepage",
  tags: ["homepage"],
  summary: "首頁課程",
  handler: [asyncHandler(getHomepageCourse)],
  router: homePage_router,
});
