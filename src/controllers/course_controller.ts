import { searchCourseLogic } from "../services/course_service";
import { JwtAsyncFunction } from "../types/asyncType";
import { success } from "../utils/success";

export const searchCourse: JwtAsyncFunction = async (req, res) => {
  const { context, categoryKey } = req.body;
  const courses = await searchCourseLogic(context, categoryKey);

  const result = courses.map((course) => ({
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
    duration: course.duration,
  }));

  success(res, 200, result);
};
