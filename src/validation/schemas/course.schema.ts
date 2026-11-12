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
import { CategoryKeyScheme } from "../rules/backstage.rule";

export const courseSchema = z.object({
  title: titleScheme,
  teacher: teacherScheme,
  content: contentScheme,
  price: priceScheme,
  originalPrice: priceScheme,
  videoKey: videoKeyScheme,
  duration: durationScheme,
  videoTicket: z.string().min(1).max(2048),
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
  .omit({ videoKey: true, duration: true, videoTicket: true })
  .extend({
    id: z.string().uuid(),
    videoKey: videoKeyScheme.optional(),
    duration: durationScheme.optional(),
    videoTicket: z.string().min(1).max(2048).optional(),
  });

export const reReviewCourseSchema = reReviewCourseBaseSchema.refine(
  ({ videoKey, duration, videoTicket }) => {
    const providedCount = [videoKey, duration, videoTicket].filter(
      (value) => value !== undefined,
    ).length;

    return providedCount === 0 || providedCount === 3;
  },
  {
    message: "videoKey、duration 與 videoTicket 必須一起提供",
    path: ["videoKey"],
  },
);
