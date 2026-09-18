import { supabase } from "../config/supabase";
import { getCourseDb } from "../repository/course_Repository";

type Course = Awaited<ReturnType<typeof getCourseDb>>[number];

export const getCourseImageUrl = async (dataList: Course[]) => {
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
