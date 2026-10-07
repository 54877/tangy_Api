import { z } from "../../config/zod";
import { TagIdScheme, TagScheme } from "../rules/backstage";

export const TagSchema = z.object({
  label: TagScheme,
});

export const EditTagSchema = z.object({
  id: TagIdScheme,
  label: TagScheme,
});
