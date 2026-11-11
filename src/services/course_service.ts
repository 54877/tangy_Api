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
import {
  issueVideoUploadTicket,
  verifyVideoUploadTicket,
} from "../utils/videoUploadTicket";
import { cleanupCourseAfterApiError } from "../utils/courseErrorCleanup";

export const createCourseVideoLogic = async (
  video: Express.Multer.File | undefined,
  userId: string,
) => {
  if (!video) {
    throw new AppError("請上傳影片", 400, "video");
  }
  let videoKey: string | undefined;
  try {
    // 影片驗證並回傳時間
    const duration = await useVideoRuler(video);

    // 上傳影片
    videoKey = await uploadCourseVideo(video);
    const videoTicket = await issueVideoUploadTicket(
      userId,
      videoKey,
      String(duration),
    );

    return { duration, videoKey, videoTicket };
  } catch (error) {
    if (videoKey) {
      await deleteCourseFile("videos", videoKey).catch(() => {});
    }
    throw error;
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
  videoTicket,
  tagsKey,
  categoryKey,
}: Omit<CourseType, "fileName" | "id" | "reviewStatus"> & {
  videoTicket: string;
}) => {
  const ticket = verifyVideoUploadTicket(
    videoTicket,
    userId,
    videoKey,
    duration,
  );

  let fileName: string | undefined;
  let imageUploadAttempted = false;
  try {
    const { tagKeys, sanitizedContent } = await validateCourseFields({
      price,
      originalPrice,
      content,
      tagsKey,
      categoryKey,
    });

    //驗證照片
    const { processedImage, fileName: imagePath } = await useImageRuler(image);
    fileName = imagePath;
    //上傳到supabase storage
    imageUploadAttempted = true;
    await uploadCourseImage(fileName, processedImage, "course");

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
      videoUploadTicketJti: ticket.jti,
      tagsKey: tagKeys.map(String),
      categoryKey,
    });
  } catch (error) {
    await cleanupCourseAfterApiError({
      verifiedVideoTicket: ticket,
      userId,
      imageUploadAttempted,
      imagePath: fileName,
      videoKey,
    });
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
