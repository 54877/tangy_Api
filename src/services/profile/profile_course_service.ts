import {
  getMyCourseDetailByIdDb,
  getCourseFormOptionsDb,
  getMyCourseDb,
} from "../../repository/profile/profile_course_repository";
import { AppError } from "../../utils/errors";
import { getStorageUrl } from "../../utils/supabase/getStorageUrl";

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
