import { z } from "../../../config/zod";
import {
  CategoryNameScheme,
  CourseCategoryIdScheme,
} from "../../rules/backstage";

export const CourseCategorySchema = z.object({
  CategoryName: CategoryNameScheme,
});

export const EditCourseCategorySchema = z.object({
  id: CourseCategoryIdScheme,
  CategoryName: CategoryNameScheme,
});

export const DeleteCourseCategorySchema = z.object({
  id: CourseCategoryIdScheme,
});
