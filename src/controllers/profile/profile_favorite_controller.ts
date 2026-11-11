import { JwtAsyncFunction } from "../../types/asyncType";
import { success } from "../../utils/success";
import {
  addFavoriteCourseLogic,
  getMyFavoriteCoursesLogic,
  removeFavoriteCourseLogic,
} from "../../services/profile/profile_favorite_service";

export const addFavoriteCourse: JwtAsyncFunction = async (req, res) => {
  await addFavoriteCourseLogic(req.user.id, req.body.id);
  success(res, 201, undefined, "已加入收藏");
};

export const removeFavoriteCourse: JwtAsyncFunction = async (req, res) => {
  await removeFavoriteCourseLogic(req.user.id, req.body.id);
  success(res, 200, undefined, "已取消收藏");
};

export const getMyFavoriteCourses: JwtAsyncFunction = async (req, res) => {
  success(res, 200, await getMyFavoriteCoursesLogic(req.user.id));
};
