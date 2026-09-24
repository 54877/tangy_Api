import { AppError } from "../utils/errors";
import { useImageRuler } from "../utils/imageValidation";
import { createCourseDb, getCourseDb } from "../repository/course_Repository";
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
  title,
  teacher,
  content,
  price,
  originalPrice,
  image,
  videoKey,
  duration,
}: Omit<CourseType, "fileName">) => {
  const sanitizedContent = sanitizeCourseContent(content);

  //驗證照片
  const { processedImage, fileName } = await useImageRuler(image);
  //上傳到supabase storage
  await uploadCourseImage(fileName, processedImage, "course");

  //執行Db
  try {
    await createCourseDb({
      title,
      teacher,
      content: sanitizedContent,
      price,
      originalPrice,
      fileName,
      videoKey,
      duration,
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
  const result = await getCourseImageUrls(dataList, "course");

  return result;
};
