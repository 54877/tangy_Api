import { requiredString } from "../primitives/string";
import { z } from "../../config/zod";

export const titleScheme = requiredString.max(30, "不可超過30個字元");

export const teacherScheme = requiredString.max(20, "不可超過20個字元");

export const priceScheme = requiredString.max(10, "不可超過10個字元");

export const videoKeyScheme = requiredString.max(47, "不可超過47個字元");

export const durationScheme = requiredString.max(10, "不可超過10個字元");

export const contentScheme = z
  .string({
    invalid_type_error: "必須是字串",
  })
  .max(7_000_000, "不可超過700萬個字元")
  .openapi({
    example: "<p>課程介紹</p>",
  });
