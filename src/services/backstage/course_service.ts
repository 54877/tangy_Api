import {
  deleteCourseByIdDb,
  getCourseByIdDb,
  reviewCourseLogicDb,
} from "../../repository/backstage/course_repository";
import { getCourseForAdminDb } from "../../repository/course_Repository";
import { AppError } from "../../utils/errors";
import { deleteCourseFile } from "../../utils/removeSupabaseStorage";
import { sanitizeCourseContent } from "../../utils/sanitizeCourseContent";
import { CourseType } from "../../types/profileType";

export const getAllCoursesForAdminLogic = async () => {
  const rows = await getCourseForAdminDb();

  return rows.map(
    ({
      id,
      title,
      originalPrice,
      price,
      rating,
      studentCount,
      courseTags,
      category,
      user,
    }) => ({
      id,
      title,
      userName: user.userName,
      category: category?.CategoryName ?? null,
      tags: courseTags.map(({ tag }) => tag.label),
      originalPrice,
      price,
      rating,
      studentCount,
    }),
  );
};

export const deleteCourseLogic = async (id: string) => {
  const course = await getCourseByIdDb(id);
  if (!course) throw new AppError("課程不存在", 404);

  try {
    await deleteCourseByIdDb(id);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("刪除課程失敗", 500);
  }

  await Promise.all([
    deleteCourseFile("video", course.video),
    deleteCourseFile("course", course.imageUrl),
  ]);
};

export const reviewCourseLogic = async ({
  id,
  title,
  teacher,
  content,
  price,
  originalPrice,
  fileName,
  videoKey,
  duration,
  reviewStatus,
  tagsKey,
  categoryKey,
}: Omit<CourseType, "image" | "userId">) => {
  await reviewCourseLogicDb({
    id,
    title,
    teacher,
    content: sanitizeCourseContent(content),
    price,
    originalPrice,
    fileName,
    videoKey,
    duration,
    reviewStatus,
    tagsKey,
    categoryKey,
  });
};
