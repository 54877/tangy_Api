import { requiredString } from "../primitives/string";

export const IdScheme = requiredString.max(100, "不可超過100個字元");
