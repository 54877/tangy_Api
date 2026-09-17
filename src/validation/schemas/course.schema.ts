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
