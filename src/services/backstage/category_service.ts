import {
  createCourseCategoryDb,
  deleteCourseCategoryDb,
  editCourseCategoryDb,
  getAllCourseCategoriesDb,
} from "../../repository/backstage/category_repository";

export const getAllCourseCategoriesLogic = () => getAllCourseCategoriesDb();

export const createCourseCategoryLogic = (CategoryName: string) =>
  createCourseCategoryDb(CategoryName);

export const editCourseCategoryLogic = (id: string, CategoryName: string) =>
  editCourseCategoryDb(id, CategoryName);

export const deleteCourseCategoryLogic = (id: string) =>
  deleteCourseCategoryDb(id);
