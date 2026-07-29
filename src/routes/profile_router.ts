import express from "express";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middlewares/auth";
import { getUser } from "../controllers/profile_controllers";

export const profile_router = express.Router();

profile_router.use(authMiddleware);

openapiRoute({
  method: "get",
  path: "/me",
  tags: ["Profile"],
  needAuth: true,
  summary: "個人資料",
  handler: [asyncHandler(getUser)],
  router: profile_router,
});
