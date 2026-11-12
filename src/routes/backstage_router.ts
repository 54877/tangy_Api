import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/role.mid";
import { backStageCategoryRouter } from "./backstage/backStage_category_router";
import { backStageCourseRouter } from "./backstage/backStage_course_router";
import { backStageTagRouter } from "./backstage/backStage_tag_router";
import { backStageUserRouter } from "./backstage/backStage_user_router";

export const backStage_router = express.Router();

backStage_router.use(authMiddleware, adminMiddleware);
backStage_router.use(backStageCourseRouter);
backStage_router.use(backStageTagRouter);
backStage_router.use(backStageUserRouter);
backStage_router.use(backStageCategoryRouter);
