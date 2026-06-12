import { z } from "../../config/zod";

export const passwordScheme = z
  .string()
  .trim()
  .min(8, "不可低於6個字元")
  .max(40, "不可超過40個字元")
  .refine(
    (val: string) => {
      return /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val);
    },
    {
      message: "密碼需包含大寫、小寫與數字",
    },
  )
  .openapi({
    example: "Abc12345",
  });

export const userNameScheme = z
  .string()
  .trim()
  .min(1, "至少1個字元")
  .max(20, "不可超過20個字元")
  .openapi({
    example: "小明",
  });
