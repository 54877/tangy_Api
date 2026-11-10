import {
  getMyCourseDetailByIdDb,
  getCourseFormOptionsDb,
  getMyCourseDb,
  updateMyCourseForReviewDb,
} from "../../repository/profile/profile_course_repository";
import { AppError } from "../../utils/errors";
import { getStorageUrl } from "../../utils/supabase/getStorageUrl";
import { useImageRuler } from "../../utils/image/imageValidation";
import { uploadCourseImage } from "../../utils/image/uploadCourseImage";
import { deleteCourseFile } from "../../utils/supabase/removeSupabaseStorage";
import { validateCourseFields } from "../../utils/courseValidation";

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
}) => {
  const course = await getMyCourseDetailByIdDb(id, userId);
  if (!course) throw new AppError("課程不存在", 404);
  if (course.reviewStatus !== "REJECTED")
    throw new AppError("課程狀態不允許重新審核", 400);
  if (!course.imageUrl && !image)
    throw new AppError("請上傳圖片", 400, "image");
  if (!course.video && !videoKey)
    throw new AppError("請上傳影片", 400, "video");

  const { tagKeys, sanitizedContent } = await validateCourseFields({
    price,
    originalPrice,
    content,
    tagsKey,
    categoryKey,
  });

  let newImagePath = course.imageUrl;
  const newVideoKey = videoKey ?? course.video;
  const newDuration = duration ?? course.duration;
  let uploadedNewImage = false;

  if (image) {
    const { processedImage, fileName } = await useImageRuler(image);
    await uploadCourseImage(fileName, processedImage, "course");
    newImagePath = fileName;
    uploadedNewImage = true;
  }

  try {
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
      tagsKey: tagKeys.map(String),
      categoryKey,
    });
    if (!updated) throw new AppError("課程不存在", 404, "id");
  } catch (error) {
    if (uploadedNewImage) {
      await deleteCourseFile("course", newImagePath);
    }
    if (videoKey && course.video !== newVideoKey) {
      await deleteCourseFile("videos", newVideoKey);
    }

    throw error;
  }
  const cleanupTasks: Promise<unknown>[] = [];

  if (uploadedNewImage && course.imageUrl !== newImagePath) {
    cleanupTasks.push(deleteCourseFile("course", course.imageUrl));
  }

  if (videoKey && course.video !== newVideoKey) {
    cleanupTasks.push(deleteCourseFile("videos", course.video));
  }
  await Promise.allSettled(cleanupTasks);
};
