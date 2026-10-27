import { requiredString } from "../primitives/string";

export const titleScheme = requiredString.max(30, "不可超過30個字元");

export const teacherScheme = requiredString.max(20, "不可超過20個字元");

export const priceScheme = requiredString
  .max(10, "不可超過10個字元")
  .regex(/^(0|[1-9]\d*)$/, "只能輸入 0~9 的數字，且不可有多餘的開頭 0");

export const videoKeyScheme = requiredString.max(47, "不可超過47個字元");

export const durationScheme = requiredString.max(10, "不可超過10個字元");

export const tagScheme = requiredString
  .max(50, "不可超過50個字元")
  .refine((value) => {
    try {
      const keys: unknown = JSON.parse(value);
      const normalizedKeys = Array.isArray(keys) ? keys : [keys];
      return normalizedKeys.every(
        (key) =>
          (typeof key === "string" && key.length > 0) ||
          (typeof key === "number" && Number.isSafeInteger(key)),
      );
    } catch {
      return false;
    }
  }, "標籤 ID 格式錯誤");

export const contentScheme = requiredString.max(
  7_000_000,
  "不可超過700萬個字元",
);
