import fs from "node:fs/promises";
import { supabase } from "../config/supabase";
import { AppError } from "./errors";

export const uploadCourseVideo = async (video: Express.Multer.File) => {
  const fileName = `${crypto.randomUUID()}.${video.mimetype === "video/mp4" ? "mp4" : "webm"}`;

  const fileBuffer = await fs.readFile(video.path);

  const { error } = await supabase.storage
    .from("videos")
    .upload(`video/${fileName}`, fileBuffer, {
      contentType: video.mimetype,
      upsert: false,
    });

  if (error) {
    console.log(error);
    throw new AppError("影片上傳失敗", 500, "video");
  }

  await fs.unlink(video.path);

  return `video/${fileName}`;
};
