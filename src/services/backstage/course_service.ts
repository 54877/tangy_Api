import {
  deleteCourseByIdDb,
  getCourseByIdDb,
  reviewCourseLogicDb,
} from "../../repository/backstage/course_repository";
import { getCourseForAdminDb } from "../../repository/course_Repository";
import { supabase } from "../../config/supabase";
import { AppError } from "../../utils/errors";
import { getCourseImageUrls } from "../../utils/getCourseImageUrl";
import { deleteCourseFile } from "../../utils/removeSupabaseStorage";
import { sanitizeCourseContent } from "../../utils/sanitizeCourseContent";
import { CourseType } from "../../types/profileType";

export const getAllCoursesForAdminLogic = async () => {
  const rows = await getCourseForAdminDb();

  const courses = rows.map(({ courseTags, category, user, ...course }) => ({
    ...course,
    tags: courseTags.map(({ tag }) => tag.label),
    category: category?.CategoryName ?? null,
    ...user,
  }));

  const coursesWithImages = await getCourseImageUrls(courses, "course");

  return Promise.all(
    coursesWithImages.map(async ({ video, ...course }) => {
      const { data, error } = await supabase.storage
        .from("videos")
        .createSignedUrl(video, 60 * 30);
      if (error) {
        throw new AppError("影片連結產生失敗", 500);
      }

      return {
        ...course,
        videoUrl: data.signedUrl,
      };
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
