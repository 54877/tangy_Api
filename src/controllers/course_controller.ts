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

  console.log("========== FILE ==========");
  console.log(video);
  console.log("fieldname:", video?.fieldname);
  console.log("originalname:", video?.originalname);
  console.log("mimetype:", video?.mimetype);
  console.log("destination:", video?.destination);
  console.log("filename:", video?.filename);
  console.log("path:", video?.path);
  console.log("size:", video?.size);
  console.log("==========================");

  const { duration, videoKey } = await createCourseVideoLogic(video);

  success(res, 200, {
    video: videoKey,
    duration: duration,
  });
};

//建立線上課程
export const createCourse: JwtAsyncFunction = async (req, res) => {
  const { title, teacher, price, originalPrice, videoKey, duration } = req.body;
  const image = req.file;

  await createCourseLogic(
    title,
    teacher,
    price,
    originalPrice,
    image,
    videoKey,
    duration,
  );

  success(res, 200);
};

//獲取線上課程列表
export const getCourse: JwtAsyncFunction = async (req, res) => {
  const data = await getCourseLogic();

  success(res, 200, data);
};
