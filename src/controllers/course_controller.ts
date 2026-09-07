import { createCourseLogic } from "../services/course_service";
import { JwtAsyncFunction } from "../types/asyncType";

export const createCourse: JwtAsyncFunction = async (req, res) => {
  const { title, teacher, price, originalPrice } = req.body;
  const image = req.file;

  await createCourseLogic(title, teacher, price, originalPrice, image);

  res.status(200).json({
    message: "成功",
    state: true,
  });
};
