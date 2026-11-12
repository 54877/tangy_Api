import {
  deleteCourseLogic,
  getAdminCourseByIdLogic,
  getCoursesForAdminLogic,
  reviewCourseLogic,
} from "../../services/backstage/backStage_course_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { success } from "../../utils/success";

export const getCoursesForAdmin: JwtAsyncFunction = async (_req, res) => {
  success(res, 200, await getCoursesForAdminLogic());
};

export const getAdminCourseById: JwtAsyncFunction = async (req, res) => {
  const { id } = req.body;
  success(res, 200, await getAdminCourseByIdLogic(id));
};

export const deleteCourse: JwtAsyncFunction = async (req, res) => {
  success(res, 200, await deleteCourseLogic(req.body.id));
};

export const reviewCourse: JwtAsyncFunction = async (req, res) => {
  success(
    res,
    200,
    await reviewCourseLogic(
      req.body.id,
      req.body.reviewStatus,
      req.body.reviewContext ?? "",
    ),
  );
};
