import { AppError } from "../utils/errors";
import { supabase } from "../config/supabase";
import { useImageRuler } from "../utils/imageValidation";
import { createCourseDb, getCourseDb } from "../repository/course_Repository";

export const createCourseLogic = async (
  title: string,
  teacher: string,
  price: string,
  originalPrice: string,
  image: Express.Multer.File | undefined,
) => {
  const { processedImage, fileName } = await useImageRuler(image);
  //上傳到supabase storage
  const { error } = await supabase.storage
    .from("course")
    .upload(fileName, processedImage, {
      contentType: "image/webp",
    });

  if (error) {
    throw new AppError("圖片上傳失敗", 500, "image");
  }

  await createCourseDb(title, teacher, price, originalPrice, fileName);
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
        .download(course.image);

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
