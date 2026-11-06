import {
  getCourseFormOptionsDb,
  getMyCourseDb,
} from "../../repository/profile/profile_course_repository";

export const getCourseFormOptionsLogic = () => getCourseFormOptionsDb();

export const getMyCourseLogic = (userId: string) => getMyCourseDb(userId);
