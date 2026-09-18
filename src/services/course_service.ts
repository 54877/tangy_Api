import { AppError } from "../utils/errors";
import { supabase } from "../config/supabase";
import { useImageRuler } from "../utils/imageValidation";
import { createCourseDb, getCourseDb } from "../repository/course_Repository";
import { useVideoRuler } from "../utils/videoValidation";
import { uploadCourseVideo } from "../utils/uploadCourseVideo";
import fs from "node:fs/promises";
import { uploadCourseImage } from "../utils/uploadCourseImage";
import { getCourseImageUrl } from "../utils/getCourseImageUrl";
import { deleteCourseFile } from "../utils/removeSupabaseStorage";

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

export const createCourseLogic = async (
  title: string,
  teacher: string,
  price: string,
  originalPrice: string,
  image: Express.Multer.File | undefined,
  video: string,
  duration: string,
) => {
  //驗證照片
  const { processedImage, fileName } = await useImageRuler(image);
  //上傳到supabase storage
  await uploadCourseImage(fileName, processedImage);

  //執行Db
  try {
    await createCourseDb(
      title,
      teacher,
      price,
      originalPrice,
      fileName,
      video,
      duration,
    );
  } catch (error) {
    await Promise.allSettled([
      deleteCourseFile("course", fileName),
      deleteCourseFile("videos", video),
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
  const result = await getCourseImageUrl(dataList);

  return result;
};
