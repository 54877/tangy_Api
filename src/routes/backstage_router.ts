import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/role.mid";
import { backStageCategoryRouter } from "./backstage/category_router";
import { backStageCourseRouter } from "./backstage/course_router";
import { backStageTagRouter } from "./backstage/tag_router";
import { backStageUserRouter } from "./backstage/user_router";

export const backStage_router = express.Router();

backStage_router.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    console.log("[Backstage API]", {
      method: req.method,
      path: req.originalUrl.split("?")[0],
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
});

// Keep authentication and the existing /tangy endpoint paths centralized.
backStage_router.use(authMiddleware, adminMiddleware);
backStage_router.use(backStageCourseRouter);
backStage_router.use(backStageTagRouter);
backStage_router.use(backStageUserRouter);
backStage_router.use(backStageCategoryRouter);
