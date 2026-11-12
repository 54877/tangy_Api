import {
  createFavoriteCourseDb,
  deleteFavoriteCourseDb,
  getApprovedCourseDb,
  getMyFavoriteCoursesDb,
} from "../../repository/profile/profile_favorite_repository";
import { AppError } from "../../utils/errors";

export const addFavoriteCourseLogic = async (
  userId: string,
  courseId: string,
) => {
  const course = await getApprovedCourseDb(courseId);
  if (!course) throw new AppError("課程不存在", 404, "id");
  await createFavoriteCourseDb(userId, courseId);
};

export const removeFavoriteCourseLogic = async (
  userId: string,
  courseId: string,
) => {
  await deleteFavoriteCourseDb(userId, courseId);
};

export const getMyFavoriteCoursesLogic = async (userId: string) => {
  const favorites = await getMyFavoriteCoursesDb(userId);
  const courses = favorites.map(({ createdAt, course }) => ({
    ...course,
    favoriteAt: createdAt,
    category: course.category?.CategoryName ?? null,
  }));
  return courses;
};
