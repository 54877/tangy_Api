import fs from "node:fs/promises";
import { supabase } from "../config/supabase";
import { AppError } from "./errors";

export const uploadCourseImage = async (
  fileName: string,
  processedImage: Buffer<ArrayBuffer>,
) => {
  const { error } = await supabase.storage
    .from("course")
    .upload(fileName, processedImage, {
      contentType: "image/webp",
    });
  if (error) {
    throw new AppError("圖片上傳失敗", 500, "image");
  }
};
