import express from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middlewares/auth";
import { openapiRoute } from "../utils/openapiRoute";
import {
  getPersonal,
  updatePersonal,
} from "../controllers/profile_controllers";

export const profile_router = express.Router();

profile_router.use(authMiddleware);

openapiRoute({
  method: "get",
  path: "/personal",
  tags: ["Profile"],
  needAuth: true,
  summary: "個人資料",
  handler: [asyncHandler(getPersonal)],
  router: profile_router,
});

openapiRoute({
  method: "put",
  path: "/personal",
  tags: ["Profile"],
  needAuth: true,
  summary: "更新個人資料",
  handler: [asyncHandler(updatePersonal)],
  router: profile_router,
});
