import { z } from "../../config/zod";

export const easyPassword = z
  .string()
  .trim()
  .min(1, "請輸入密碼")
  .max(40, "字元不可超過40個")
  .openapi({
    example: "string",
  });
