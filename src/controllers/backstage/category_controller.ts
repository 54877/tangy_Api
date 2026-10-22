import {
  createCourseCategoryLogic,
  deleteCourseCategoryLogic,
  editCourseCategoryLogic,
  getAllCourseCategoriesLogic,
} from "../../services/backstage/category_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { isAdmin } from "../../utils/role";
import { success } from "../../utils/success";

export const getAllCourseCategories: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  success(res, 200, await getAllCourseCategoriesLogic());
};

export const createCourseCategory: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const category = await createCourseCategoryLogic(req.body.CategoryName);
  success(res, 201, category);
};

export const editCourseCategory: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const { id, CategoryName } = req.body;
  const category = await editCourseCategoryLogic(id, CategoryName);
  success(res, 200, category);
};

export const deleteCourseCategory: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  await deleteCourseCategoryLogic(req.body.id);
  success(res, 200);
};
