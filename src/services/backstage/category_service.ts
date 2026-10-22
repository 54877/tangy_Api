import {
  createCourseCategoryDb,
  deleteCourseCategoryDb,
  editCourseCategoryDb,
  getAllCourseCategoriesDb,
} from "../../repository/backstage/category_repository";

export const getAllCourseCategoriesLogic = () => getAllCourseCategoriesDb();

export const createCourseCategoryLogic = (CategoryName: string) =>
  createCourseCategoryDb(CategoryName);

export const editCourseCategoryLogic = (categoryKey: string, CategoryName: string) =>
  editCourseCategoryDb(categoryKey, CategoryName);

export const deleteCourseCategoryLogic = (categoryKey: string) =>
  deleteCourseCategoryDb(categoryKey);
