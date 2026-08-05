import { requiredString } from "../primitives/string";

export const genderScheme = requiredString.max(5, "不可超過5個字元");

export const birthdayScheme = requiredString.max(20, "不可超過20個字元");

export const introductionScheme = requiredString.max(200, "不可超過200個字元");
