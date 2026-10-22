import { deleteCourseLogic, reviewCourseLogic } from "../../services/backstage/course_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { isAdmin } from "../../utils/role";
import { success } from "../../utils/success";

export const deleteCourse: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  await deleteCourseLogic(req.body.id);
  success(res, 200);
};

export const reviewCourse: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
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
  });
  success(res, 200);
};
