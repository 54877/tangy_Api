import { z } from "../../config/zod";
import {
  contentScheme,
  durationScheme,
  priceScheme,
  teacherScheme,
  titleScheme,
  videoKeyScheme,
} from "../rules/course.rule";

export const courseSchema = z.object({
  title: titleScheme,
  teacher: teacherScheme,
  content: contentScheme,
  price: priceScheme,
  originalPrice: priceScheme,
  videoKey: videoKeyScheme,
  duration: durationScheme,
});

// 上傳檔案由 Multer 此 schema 僅供 OpenAPI 文件使用。
export const createCourseOpenapiSchema = courseSchema.extend({
  image: z.string().openapi({
    format: "binary",
    description: "課程封面圖片（JPG、JPEG 或 PNG）",
  }),
});

export const createCourseVideoOpenapiSchema = z.object({
  video: z.string().openapi({
    format: "binary",
    description: "MP4 (video/mp4)、WebM (video/webm)",
  }),
});
