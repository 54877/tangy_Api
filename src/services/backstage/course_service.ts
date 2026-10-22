import {
  deleteCourseByIdDb,
  getCourseByIdDb,
  reviewCourseLogicDb,
} from "../../repository/backstage/course_repository";
import { AppError } from "../../utils/errors";
import { deleteCourseFile } from "../../utils/removeSupabaseStorage";
import { sanitizeCourseContent } from "../../utils/sanitizeCourseContent";
import { CourseType } from "../../types/profileType";

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
}: Omit<CourseType, "image">) => {
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
  });
};
