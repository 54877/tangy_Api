import { AppError } from "../utils/errors";
import { supabase } from "../config/supabase";
import { useImageRuler } from "../utils/imageValidation";
import { createCourseDb } from "../repository/course_Repository";

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
