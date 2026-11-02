import { z } from "../../config/zod";
import { IdScheme, UuidIdScheme } from "../rules/common.rule";

export const IdSchema = z.object({
  id: IdScheme,
});

export const UuidIdSchema = z.object({
  id: UuidIdScheme,
});

export const UuidUserIdSchema = z.object({
  userId: UuidIdScheme,
});

export const KeySchema = z.object({
  key: IdScheme,
});
