import { createCourseLogic, getCourseLogic } from "../services/course_service";
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

export const getCourse: JwtAsyncFunction = async (req, res) => {
  const data = await getCourseLogic();

  console.log(data);

  res.status(200).json({
    data,
    message: "成功",
    state: true,
  });
};
