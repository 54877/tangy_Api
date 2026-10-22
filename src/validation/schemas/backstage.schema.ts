import { z } from "../../config/zod";
import {
  CategoryNameScheme,
  CourseCategoryIdScheme,
  TagIdScheme,
  TagScheme,
} from "../rules/backstage";

export const TagSchema = z.object({
  label: TagScheme,
});

export const EditTagSchema = z.object({
  key: TagIdScheme,
  label: TagScheme,
});

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
