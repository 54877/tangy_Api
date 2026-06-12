import { z } from "../../config/zod";

export const requiredString = z
  .string({
    invalid_type_error: "必須是字串",
  })
  .trim()
  .min(1, "不可為空")
  .openapi({
    example: "string",
  });

export const optionalString = z
  .string({
    invalid_type_error: "必須是字串",
  })
  .trim()
  .optional()
  .openapi({
    example: "string",
  });
