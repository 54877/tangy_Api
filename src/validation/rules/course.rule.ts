import { requiredString } from "../primitives/string";
import { MAX_MULTIPART_FIELD_SIZE } from "../../constants/upload";

export const titleScheme = requiredString.max(30, "不可超過30個字元");

export const teacherScheme = requiredString.max(20, "不可超過20個字元");

export const priceScheme = requiredString
  .max(10, "不可超過10個字元")
  .regex(/^(0|[1-9]\d*)$/, "只能輸入 0~9 的數字，且不可有多餘的開頭 0");

export const videoKeyScheme = requiredString.max(47, "不可超過47個字元");

export const durationScheme = requiredString
  .regex(/^(?:0|[1-9]\d*)(?:\.\d+)?$/, "影片時長格式錯誤")
  .refine((value) => {
    const seconds = Number(value);
    return Number.isFinite(seconds) && seconds > 0 && seconds <= 7200;
  }, "影片時長必須大於 0 且不可超過 2 小時");

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

export const contentScheme = requiredString
  .max(7_000_000, "不可超過700萬個字元")
  .refine(
    (value) => Buffer.byteLength(value, "utf8") <= MAX_MULTIPART_FIELD_SIZE,
    "課程內容不可超過 2 MB",
  );
