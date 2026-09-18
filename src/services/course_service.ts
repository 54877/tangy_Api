import { AppError } from "../utils/errors";
import { supabase } from "../config/supabase";
import { useImageRuler } from "../utils/imageValidation";
import { createCourseDb, getCourseDb } from "../repository/course_Repository";
import { useVideoRuler } from "../utils/videoValidation";
import { uploadCourseVideo } from "../utils/uploadCourseVideo";
import fs from "node:fs/promises";
import { uploadCourseImage } from "../utils/uploadCourseImage";

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
  await createCourseDb(
    title,
    teacher,
    price,
    originalPrice,
    fileName,
    video,
    duration,
  );
};

export const getCourseLogic = async () => {
  const dataList = await getCourseDb();

  if (!dataList || dataList.length === 0) {
    return [];
  }

  const result = await Promise.all(
    dataList.map(async (course) => {
      const { data, error } = await supabase.storage
        .from("course")
        .createSignedUrl(course.image, 60 * 10);

      if (error) {
        console.error("圖片下載失敗", {
          courseId: course.id,
          error,
        });

        return {
          ...course,
          image: null,
        };
      }

      return {
        ...course,
        image: data,
      };
    }),
  );

  return result;
};
