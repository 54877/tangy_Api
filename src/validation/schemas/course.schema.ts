import { z } from "../../config/zod";
import {
  durationScheme,
  priceScheme,
  teacherScheme,
  titleScheme,
  videoScheme,
} from "../rules/course.rule";

export const courseSchema = z.object({
  title: titleScheme,
  teacher: teacherScheme,
  price: priceScheme,
  originalPrice: priceScheme,
  video: videoScheme,
  duration: durationScheme,
});

// 上傳檔案由 Multer 寫入 req.file，不在 req.body；此 schema 僅供 OpenAPI 文件使用。
export const createCourseOpenapiSchema = courseSchema.extend({
  image: z.string().openapi({
    format: "binary",
    description: "課程封面圖片（JPG、JPEG 或 PNG）",
  }),
});
