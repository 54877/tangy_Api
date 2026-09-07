import { z } from "../../config/zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

//必填
export const requiredString = z
  .string({
    invalid_type_error: "必須是字串",
  })
  .trim()
  .min(1, "不可為空")
  .openapi({
    example: "string",
  });

//檢查是否為字串
export const optionalString = z
  .string({
    invalid_type_error: "必須是字串",
  })
  .trim()
  .optional()
  .openapi({
    example: "string",
  });

//檢查是否為日期包含時間
export const requiredDateTime = z
  .string({
    invalid_type_error: "必須是字串",
  })
  .trim()
  .min(1, "不可為空")
  .regex(dateTimeRegex, "日期格式需為 YYYY-MM-DD HH:mm")
  .openapi({
    example: "string",
  });

//檢查是否為日期不包含時間
export const requiredDate = z
  .string({
    invalid_type_error: "必須是字串",
  })
  .trim()
  .min(1, "不可為空")
  .regex(dateRegex, "日期格式需為 YYYY-MM-DD")
  .openapi({
    example: "string",
  });
