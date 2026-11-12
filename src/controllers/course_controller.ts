import { getCourseLogic } from "../services/course_service";
import { JwtAsyncFunction } from "../types/asyncType";
import { success } from "../utils/success";

//獲取線上課程列表
export const getCourse: JwtAsyncFunction = async (req, res) => {
  const data = await getCourseLogic();

  const result = data.map((course) => ({
    id: course.id,
    imageUrl: course.imageUrl,
    originalPrice: course.originalPrice,
    price: course.price,
    rating: course.rating,
    studentCount: course.studentCount,
    teacher: course.teacher,
    title: course.title,
    tags: course.tags,
    category: course.category,
    duration: String(Math.round(+course.duration) / 60),
  }));
  success(res, 200, result);
};
