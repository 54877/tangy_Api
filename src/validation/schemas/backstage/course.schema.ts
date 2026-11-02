import { z } from "../../../config/zod";
import { UuidIdScheme } from "../../rules/common.rule";

export const reviewCourseSchema = z.object({
  id: UuidIdScheme,
  reviewStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});
