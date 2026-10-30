import {
  deleteCourseLogic,
  getAllCoursesForAdminLogic,
  reviewCourseLogic,
} from "../../services/backstage/course_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { success } from "../../utils/success";

export const getAllCoursesForAdmin: JwtAsyncFunction = async (_req, res) => {
  success(res, 200, await getAllCoursesForAdminLogic());
};

export const deleteCourse: JwtAsyncFunction = async (req, res) => {
  await deleteCourseLogic(req.body.id);
  success(res, 200);
};

export const reviewCourse: JwtAsyncFunction = async (req, res) => {
  const {
    id,
    title,
    teacher,
    content,
    price,
    originalPrice,
    videoKey,
    duration,
    fileName,
    reviewStatus,
    tagsKey,
    categoryKey,
  } = req.body;
  await reviewCourseLogic({
    id,
    title,
    teacher,
    content,
    price,
    originalPrice,
    fileName,
    videoKey,
    duration,
    reviewStatus,
    tagsKey,
    categoryKey,
  });
  success(res, 200);
};
