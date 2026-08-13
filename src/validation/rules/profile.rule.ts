import { requiredDate, requiredString } from "../primitives/string";

export const genderScheme = requiredString.max(10, "不可超過10個字元");

export const birthdayScheme = requiredDate.max(20, "不可超過20個字元");

export const introductionScheme = requiredString.max(200, "不可超過200個字元");
