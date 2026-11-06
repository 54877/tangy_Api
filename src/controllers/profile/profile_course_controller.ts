import { getCourseFormOptionsLogic } from "../../services/profile/profile_course_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { success } from "../../utils/success";

export const getCourseFormOptions: JwtAsyncFunction = async (_req, res) => {
  success(res, 200, await getCourseFormOptionsLogic());
};
