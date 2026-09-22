import {
  createCourseLogic,
  createCourseVideoLogic,
  getCourseLogic,
} from "../services/course_service";
import { JwtAsyncFunction } from "../types/asyncType";
import { success } from "../utils/success";

//建立線上課程-video
export const createCourseVideo: JwtAsyncFunction = async (req, res) => {
  const video = req.file;

  const { duration, videoKey } = await createCourseVideoLogic(video);

  success(res, 200, {
    videoKey,
    duration,
  });
};

//建立線上課程
export const createCourse: JwtAsyncFunction = async (req, res) => {
  const { title, teacher, content, price, originalPrice, videoKey, duration } =
    req.body;
  const image = req.file;

  await createCourseLogic({
    title,
    teacher,
    content,
    price,
    originalPrice,
    image,
    videoKey,
    duration,
  });

  success(res, 200);
};

//獲取線上課程列表
export const getCourse: JwtAsyncFunction = async (req, res) => {
  const data = await getCourseLogic();

  const result = data.map((course) => ({
    id: course.id,
    image: course.image?.signedUrl,
    originalPrice: course.originalPrice,
    price: course.price,
    rating: course.rating,
    studentCount: course.studentCount,
    teacher: course.teacher,
    title: course.title,
    duration: String(Math.round(+course.duration) / 60),
  }));
  success(res, 200, result);
};
