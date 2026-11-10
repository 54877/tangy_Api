import { AppError } from "../utils/errors";
import { useImageRuler } from "../utils/image/imageValidation";
import { createCourseDb, getCourseDb } from "../repository/course_Repository";
import { useVideoRuler } from "../utils/video/videoValidation";
import { uploadCourseVideo } from "../utils/video/uploadCourseVideo";
import fs from "node:fs/promises";
import { uploadCourseImage } from "../utils/image/uploadCourseImage";
import { getStorageUrls } from "../utils/supabase/getStorageUrl";
import { deleteCourseFile } from "../utils/supabase/removeSupabaseStorage";
import { CourseType } from "../types/profileType";
import { validateCourseFields } from "../utils/courseValidation";

export const createCourseVideoLogic = async (
  video: Express.Multer.File | undefined,
) => {
  if (!video) {
    throw new AppError("請上傳影片", 400, "video");
  }
  try {
    // 影片驗證並回傳時間
    const duration = await useVideoRuler(video);

    // 上傳影片
    const videoKey = await uploadCourseVideo(video);

    return { duration, videoKey };
  } finally {
    await fs.unlink(video.path).catch(() => {});
  }
};

export const createCourseLogic = async ({
  userId,
  title,
  teacher,
  content,
  price,
  originalPrice,
  image,
  videoKey,
  duration,
  tagsKey,
  categoryKey,
}: Omit<CourseType, "fileName" | "id" | "reviewStatus">) => {
  const { tagKeys, sanitizedContent } = await validateCourseFields({
    price,
    originalPrice,
    content,
    tagsKey,
    categoryKey,
  });

  //驗證照片
  const { processedImage, fileName } = await useImageRuler(image);
  //上傳到supabase storage
  await uploadCourseImage(fileName, processedImage, "course");

  //執行Db
  try {
    await createCourseDb({
      userId,
      title,
      teacher,
      content: sanitizedContent,
      price,
      originalPrice,
      fileName,
      videoKey,
      duration,
      tagsKey: tagKeys.map(String),
      categoryKey,
    });
  } catch (error) {
    await Promise.allSettled([
      deleteCourseFile("course", fileName),
      deleteCourseFile("videos", videoKey),
    ]);
    throw error;
  }
};

export const getCourseLogic = async () => {
  const dataList = await getCourseDb();

  if (!dataList || dataList.length === 0) {
    return [];
  }

  //取得image url加入dataList
  const courses = dataList.map(({ courseTags, category, ...course }) => ({
    ...course,
    tags: courseTags.map(({ tag }) => tag.label),
    category: category?.CategoryName ?? null,
  }));

  const result = await getStorageUrls(courses, "course", "image");

  return result;
};
