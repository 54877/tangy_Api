import { searchCourseDb } from "../repository/course_Repository";
import { getStorageUrls } from "../utils/supabase/getStorageUrl";

export const searchCourseLogic = async (
  context?: string,
  categoryKey?: string[],
) => {
  const dataList = await searchCourseDb(context, categoryKey);

  const courses = dataList.map(({ courseTags, category, ...course }) => ({
    ...course,
    tags: courseTags.map(({ tag }) => tag.label),
    category: category?.CategoryName ?? null,
  }));

  return getStorageUrls(courses, "course", "image");
};
