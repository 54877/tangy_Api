import {
  getMyCourseDetailByIdLogic,
  getCourseFormOptionsLogic,
  getMyCourseLogic,
} from "../../services/profile/profile_course_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { success } from "../../utils/success";

export const getCourseFormOptions: JwtAsyncFunction = async (_req, res) => {
  success(res, 200, await getCourseFormOptionsLogic());
};

export const getMyCourse: JwtAsyncFunction = async (req, res) => {
  success(res, 200, await getMyCourseLogic(req.user.id));
};

export const getMyCourseDetailById: JwtAsyncFunction = async (req, res) => {
  success(
    res,
    200,
    await getMyCourseDetailByIdLogic(req.body.id, req.user.id),
  );
};
