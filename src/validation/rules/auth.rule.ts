import { requiredString } from "../primitives/string";

export const userNameScheme = requiredString.max(20, "不可超過20個字元");

export const email = requiredString
  .email("請輸入正確email格式")
  .max(100, "不可超過100個字元");

export const passwordScheme = (mode: "strong" | "weak") => {
  const base = requiredString.max(40, "不可超過40個字元");

  if (mode === "weak") return base;

  return base.min(8, "不可低於8個字元").refine(
    (val: string) => {
      return /[A-Z]/.test(val) && /[a-z]/.test(val) && /\d/.test(val);
    },
    {
      message: "密碼需包含大寫、小寫與數字",
    },
  );
};

export const codeScheme = requiredString.max(7, "不可超過7個字元");
