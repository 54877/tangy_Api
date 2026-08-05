import express from "express";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middlewares/auth";
import { getUser } from "../controllers/nav_controllers";

export const nav_router = express.Router();

nav_router.use(authMiddleware);

openapiRoute({
  method: "get",
  path: "/me",
  tags: ["Profile"],
  needAuth: true,
  summary: "個人資料",
  handler: [asyncHandler(getUser)],
  router: nav_router,
});
