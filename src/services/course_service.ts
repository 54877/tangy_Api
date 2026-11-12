import { getCourseDb } from "../repository/course_Repository";
import { getStorageUrls } from "../utils/supabase/getStorageUrl";

export const getCourseLogic = async () => {
  const dataList = await getCourseDb();

  if (!dataList || dataList.length === 0) {
    return [];
  }

  const courses = dataList.map(({ courseTags, category, ...course }) => ({
    ...course,
    tags: courseTags.map(({ tag }) => tag.label),
    category: category?.CategoryName ?? null,
  }));

  //取得image url加入dataList
  const result = await getStorageUrls(courses, "course", "image");

  return result;
};
