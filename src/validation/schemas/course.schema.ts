import { z } from "../../config/zod";
import {
  contentScheme,
  durationScheme,
  priceScheme,
  tagScheme,
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
  tagsKey: tagScheme,
});

export const createCourseVideoOpenapiSchema = z.object({
  video: z.string().openapi({
    format: "binary",
    description: "MP4 (video/mp4)、WebM (video/webm)",
  }),
});
