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
import { CategoryKeyScheme } from "../rules/backstage";

export const courseSchema = z.object({
  title: titleScheme,
  teacher: teacherScheme,
  content: contentScheme,
  price: priceScheme,
  originalPrice: priceScheme,
  videoKey: videoKeyScheme,
  duration: durationScheme,
  tagsKey: tagScheme,
  categoryKey: CategoryKeyScheme,
});

export const createCourseVideoOpenapiSchema = z.object({
  video: z.string().openapi({
    format: "binary",
    description: "MP4 (video/mp4)、WebM (video/webm)",
  }),
});

export const reReviewCourseBaseSchema = courseSchema
  .omit({ videoKey: true, duration: true })
  .extend({
    id: z.string().uuid(),
    videoKey: videoKeyScheme.optional(),
    duration: durationScheme.optional(),
  });

export const reReviewCourseSchema = reReviewCourseBaseSchema.refine(
  ({ videoKey, duration }) => Boolean(videoKey) === Boolean(duration), {
    message: "影片 videoKey 與 duration 必須同時提供",
    path: ["videoKey"],
  },
);
