import { getHomepageCourseLogic } from "../services/homePage_service";
import { AsyncFunction } from "../types/asyncType";
import { success } from "../utils/success";

export const getHomepageCourse: AsyncFunction = async (_req, res) => {
  const courses = await getHomepageCourseLogic();

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
    duration: String(Math.round(+course.duration) / 60),
  }));

  success(res, 200, result);
};
