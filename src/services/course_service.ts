import { AppError } from "../utils/errors";
import { useImageRuler } from "../utils/imageValidation";
import { createCourseDb, getCourseDb } from "../repository/course_Repository";
import { getCourseCategoryByKeyDb } from "../repository/backstage/category_repository";
import { getTagsByKeysDb } from "../repository/backstage/tag_repository";
import { useVideoRuler } from "../utils/videoValidation";
import { uploadCourseVideo } from "../utils/uploadCourseVideo";
import fs from "node:fs/promises";
import { uploadCourseImage } from "../utils/uploadCourseImage";
import { getCourseImageUrls } from "../utils/getCourseImageUrl";
import { deleteCourseFile } from "../utils/removeSupabaseStorage";
import { sanitizeCourseContent } from "../utils/sanitizeCourseContent";
import { CourseType } from "../types/profileType";

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
  const category = await getCourseCategoryByKeyDb(categoryKey);

  if (!category) {
    throw new AppError("課程分類不存在", 400, "categoryKey");
  }

  const tagKeys = [...new Set(tagsKey.map(Number))];

  if (tagKeys.some((key) => !Number.isSafeInteger(key))) {
    throw new AppError("包含不存在的標籤", 400, "tagsKey");
  }
  const existingTags = await getTagsByKeysDb(tagKeys);

  if (existingTags.length !== tagKeys.length) {
    throw new AppError("包含不存在的標籤", 400, "tagsKey");
  }

  const sanitizedContent = sanitizeCourseContent(content);

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

  const result = await getCourseImageUrls(courses, "course");

  return result;
};
