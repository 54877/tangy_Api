import { requiredString } from "../primitives/string";

export const titleScheme = requiredString.max(30, "不可超過30個字元");

export const teacherScheme = requiredString.max(20, "不可超過20個字元");

export const priceScheme = requiredString.max(10, "不可超過10個字元");
