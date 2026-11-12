import {
  createCourseCategoryDb,
  deleteCourseCategoryDb,
  editCourseCategoryDb,
  getAllCourseCategoriesDb,
  hasCoursesInCategoryDb,
} from "../../repository/backstage/backStage_category_repository";
import { AppError } from "../../utils/errors";

export const getAllCourseCategoriesLogic = () => getAllCourseCategoriesDb();

export const createCourseCategoryLogic = (CategoryName: string) =>
  createCourseCategoryDb(CategoryName);

export const editCourseCategoryLogic = (categoryKey: string, CategoryName: string) =>
  editCourseCategoryDb(categoryKey, CategoryName);

export const deleteCourseCategoryLogic = async (categoryKey: string) => {
  if (await hasCoursesInCategoryDb(categoryKey)) {
    throw new AppError("此分類還有相關課程，請先移除該課程", 409);
  }

  return deleteCourseCategoryDb(categoryKey);
};
