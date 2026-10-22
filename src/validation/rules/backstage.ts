import { requiredString } from "../primitives/string";

export const TagIdScheme = requiredString.max(100, "不可超過100個字元");

export const TagScheme = requiredString.max(10, "不可超過10個字元");

export const CategoryKeyScheme = requiredString.uuid("分類 ID 格式錯誤");

export const CategoryNameScheme = requiredString.max(10, "不可超過10個字元");
