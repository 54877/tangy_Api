import {
  deleteCourseByIdDb,
  getCourseByIdDb,
  getCourseDetailByIdDb,
  getCourseTagKeysByIdDb,
  reviewCourseStatusDb,
} from "../../repository/backstage/course_repository";
import { getCourseForAdminDb } from "../../repository/course_Repository";
import { AppError } from "../../utils/errors";
import { deleteCourseFile } from "../../utils/supabase/removeSupabaseStorage";
import { getStorageUrl } from "../../utils/supabase/getStorageUrl";
import { CourseType } from "../../types/profileType";

export const getCoursesForAdminLogic = async () => {
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
      reviewStatus,
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
      reviewStatus,
      rating,
      studentCount,
    }),
  );
};

export const getAdminCourseByIdLogic = async (id: string) => {
  const course = await getCourseDetailByIdDb(id);

  if (!course) {
    throw new AppError("課程不存在", 404, "id");
  }

  const [courseWithImageUrl, courseWithVideoUrl] = await Promise.all([
    getStorageUrl(course, "course", "image"),
    getStorageUrl(course, "videos", "video"),
  ]);

  const {
    video: _videoKey,
    courseTags,
    category,
    user,
    ...courseDetails
  } = course;

  return {
    ...courseDetails,
    imageUrl: courseWithImageUrl.imageUrl,
    videoUrl: courseWithVideoUrl.videoUrl,
    category: category.CategoryName,
    tags: courseTags.map(({ tag }) => tag.label),
    userName: user.userName,
  };
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

export const reviewCourseLogic = async (
  id: string,
  reviewStatus: CourseType["reviewStatus"],
  reviewContext: string,
) => {
  const course = await getCourseTagKeysByIdDb(id);

  if (!course) {
    throw new AppError("課程不存在", 404, "id");
  }

  if (course.courseTags.length === 0 && reviewStatus === "APPROVED") {
    throw new AppError("課程至少需要一個標籤才能審核", 400);
  }

  if (reviewContext === "" && reviewStatus === "REJECTED") {
    throw new AppError("審核意見不能為空", 400, "reviewContext");
  }

  await reviewCourseStatusDb(id, reviewStatus, reviewContext);
};
