import { z } from "../../../config/zod";
import {
  CategoryNameScheme,
  CategoryKeyScheme,
} from "../../rules/backstage";

export const CourseCategorySchema = z.object({
  CategoryName: CategoryNameScheme,
});

export const EditCourseCategorySchema = z.object({
  categoryKey: CategoryKeyScheme,
  CategoryName: CategoryNameScheme,
});

export const DeleteCourseCategorySchema = z.object({
  categoryKey: CategoryKeyScheme,
});
