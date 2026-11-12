import {
  getMyCourseDetailByIdDb,
  getCourseFormOptionsDb,
  getMyCourseDb,
  updateMyCourseForReviewDb,
  createCourseDb,
} from "../../repository/profile/profile_course_repository";
import { AppError } from "../../utils/errors";
import { getStorageUrl } from "../../utils/supabase/getStorageUrl";
import { useImageRuler } from "../../utils/image/imageValidation";
import { uploadCourseImage } from "../../utils/image/uploadCourseImage";
import { deleteCourseFile } from "../../utils/supabase/removeSupabaseStorage";
import { validateCourseFields } from "../../utils/courseValidation";
import {
  verifyVideoUploadTicket,
  issueVideoUploadTicket,
} from "../../utils/videoUploadTicket";
import { cleanupCourseAfterApiError } from "../../utils/courseErrorCleanup";
import { CourseType } from "../../types/profileType";
import { useVideoRuler } from "../../utils/video/videoValidation";
import { uploadCourseVideo } from "../../utils/video/uploadCourseVideo";
import fs from "node:fs/promises";

export const createCourseVideoLogic = async (
  video: Express.Multer.File | undefined,
  userId: string,
) => {
  if (!video) throw new AppError("請上傳影片", 400, "video");

  let videoKey: string | undefined;
  try {
    const duration = await useVideoRuler(video);
    videoKey = await uploadCourseVideo(video);
    const videoTicket = await issueVideoUploadTicket(
      userId,
      videoKey,
      String(duration),
    );
    return { duration, videoKey, videoTicket };
  } catch (error) {
    if (videoKey) await deleteCourseFile("videos", videoKey).catch(() => {});
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
    const { processedImage, fileName: imagePath } = await useImageRuler(image);
    fileName = imagePath;
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

export const getCourseFormOptionsLogic = () => getCourseFormOptionsDb();

export const getMyCourseLogic = (userId: string) => getMyCourseDb(userId);

export const getMyCourseDetailByIdLogic = async (
  id: string,
  userId: string,
) => {
  const course = await getMyCourseDetailByIdDb(id, userId);

  if (!course) {
    throw new AppError("課程不存在", 404, "id");
  }

  const [courseWithImageUrl, courseWithVideoUrl] = await Promise.all([
    getStorageUrl(course, "course", "image"),
    getStorageUrl(course, "videos", "video"),
  ]);

  const { video: _videoKey, courseTags, category, ...courseDetails } = course;

  return {
    ...courseDetails,
    videoKey: _videoKey,
    imageUrl: courseWithImageUrl.imageUrl,
    videoUrl: courseWithVideoUrl.videoUrl,
    category: category?.CategoryName ?? null,
    tags: courseTags.map(({ tag }) => tag.label),
    tagsKey: course.tagsKey,
  };
};

//影片videokey 憑證驗證
const videoKeyValidator = (
  videoKey: string | undefined,
  duration: string | undefined,
  videoTicket: string | undefined,
  userId: string,
) => {
  let verifiedVideoTicket:
    | ReturnType<typeof verifyVideoUploadTicket>
    | undefined;
  const hasVideoKey = videoKey !== undefined;
  const hasDuration = duration !== undefined;
  const hasVideoTicket = videoTicket !== undefined;

  if (hasVideoKey && hasDuration && hasVideoTicket) {
    verifiedVideoTicket = verifyVideoUploadTicket(
      videoTicket,
      userId,
      videoKey,
      duration,
    );
  } else if (hasVideoKey || hasDuration || hasVideoTicket) {
    throw new AppError(
      "videoKey、duration 與 videoTicket 必須一起提供",
      400,
      "videoTicket",
    );
  }
  return verifiedVideoTicket;
};

//課程驗證
const courseValidator = (
  course: any,
  image?: Express.Multer.File,
  videoKey?: string,
) => {
  if (course.reviewStatus !== "REJECTED")
    throw new AppError("課程狀態不允許重新審核", 400);
  if (!course.imageUrl && !image)
    throw new AppError("請上傳圖片", 400, "image");
  if (!course.video && !videoKey)
    throw new AppError("請上傳影片", 400, "video");
};

export const reReviewMyCourseLogic = async ({
  id,
  userId,
  title,
  teacher,
  content,
  price,
  originalPrice,
  categoryKey,
  tagsKey,
  image,
  videoKey,
  duration,
  videoTicket,
}: {
  id: string;
  userId: string;
  title: string;
  teacher: string;
  content: string;
  price: string;
  originalPrice: string;
  categoryKey: string;
  tagsKey: string[];
  image?: Express.Multer.File;
  videoKey?: string;
  duration?: string;
  videoTicket?: string;
}) => {
  const course = await getMyCourseDetailByIdDb(id, userId);
  if (!course) throw new AppError("課程不存在", 404);

  //影片憑證驗證
  const verifiedVideoTicket = videoKeyValidator(
    videoKey,
    duration,
    videoTicket,
    userId,
  );

  //video 與 image 上傳處理
  let newImagePath = course.imageUrl;
  const newVideoKey = verifiedVideoTicket?.videoKey ?? course.video;
  const newDuration = verifiedVideoTicket?.duration ?? course.duration;
  let imageUploadAttempted = false;

  try {
    //course的image 與 videoKey 驗證
    courseValidator(course, image, videoKey);

    //一般欄位驗證
    const { tagKeys, sanitizedContent } = await validateCourseFields({
      price,
      originalPrice,
      content,
      tagsKey,
      categoryKey,
    });

    if (image) {
      const { processedImage, fileName } = await useImageRuler(image);
      newImagePath = fileName;
      imageUploadAttempted = true;
      await uploadCourseImage(fileName, processedImage, "course");
    }

    const updated = await updateMyCourseForReviewDb({
      id,
      userId,
      title,
      teacher,
      content: sanitizedContent,
      price,
      originalPrice,
      imageUrl: newImagePath,
      video: newVideoKey,
      duration: newDuration,
      videoUploadTicketJti: verifiedVideoTicket?.jti,
      tagsKey: tagKeys.map(String),
      categoryKey,
    });
    if (!updated) throw new AppError("課程不存在", 404, "id");
  } catch (error) {
    await cleanupCourseAfterApiError({
      verifiedVideoTicket,
      userId,
      imageUploadAttempted,
      imagePath: newImagePath,
      videoKey: newVideoKey,
    });
    throw error;
  }
  const cleanupTasks: Promise<unknown>[] = [];

  if (imageUploadAttempted && course.imageUrl !== newImagePath) {
    cleanupTasks.push(deleteCourseFile("course", course.imageUrl));
  }

  if (videoKey && course.video !== newVideoKey) {
    cleanupTasks.push(deleteCourseFile("videos", course.video));
  }
  await Promise.allSettled(cleanupTasks);
};
