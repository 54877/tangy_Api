import { z } from "../../config/zod";
import { priceScheme, teacherScheme, titleScheme } from "../rules/course.rule";

export const courseSchema = z.object({
  title: titleScheme,
  teacher: teacherScheme,
  price: priceScheme,
  originalPrice: priceScheme,
});
