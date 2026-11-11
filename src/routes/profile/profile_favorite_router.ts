import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { openapiRoute } from "../../utils/openapiRoute";
import { UuidIdSchema } from "../../validation/schemas/common.schema";
import {
  addFavoriteCourse,
  getMyFavoriteCourses,
  removeFavoriteCourse,
} from "../../controllers/profile/profile_favorite_controller";

export const profileFavoriteRouter = express.Router();
profileFavoriteRouter.use(authMiddleware);

openapiRoute({
  method: "post",
  path: "/favoriteCourse",
  tags: ["Profile / Favorites"],
  needAuth: true,
  summary: "收藏課程",
  schema: UuidIdSchema,
  handler: [asyncHandler(addFavoriteCourse)],
  router: profileFavoriteRouter,
});

openapiRoute({
  method: "delete",
  path: "/favoriteCourse",
  tags: ["Profile / Favorites"],
  needAuth: true,
  summary: "取消收藏課程",
  schema: UuidIdSchema,
  handler: [asyncHandler(removeFavoriteCourse)],
  router: profileFavoriteRouter,
});

openapiRoute({
  method: "get",
  path: "/myFavoriteCourse",
  tags: ["Profile / Favorites"],
  needAuth: true,
  summary: "取得我的收藏課程",
  handler: [asyncHandler(getMyFavoriteCourses)],
  router: profileFavoriteRouter,
});
