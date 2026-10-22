import {
  createCourseCategoryLogic,
  createTagLogic,
  deleteCourseCategoryLogic,
  deleteTagLogic,
  editTagLogic,
  deleteCourseLogic,
  getAllUsersLogic,
  getAllTagsLogic,
  getAllCourseCategoriesLogic,
  editCourseCategoryLogic,
  editUserRoleLogic,
  reviewCourseLogic,
} from "../services/backstage_service";
import { JwtAsyncFunction } from "../types/asyncType";
import { isAdmin } from "../utils/role";
import { success } from "../utils/success";

export const createTag: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const { label } = req.body;

  await createTagLogic(label);

  success(res, 200);
};

export const deleteTag: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const { key } = req.body;

  await deleteTagLogic(Number(key));

  success(res, 200);
};

export const editTag: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const { key, label } = req.body;

  await editTagLogic(Number(key), label);

  success(res, 200);
};

export const deleteCourse: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const { id } = req.body;

  await deleteCourseLogic(id);

  success(res, 200);
};

export const getAllUsers: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const userData = await getAllUsersLogic();

  const result = userData.map((user) => ({
    id: user.id,
    createdAt: user.createdAt,
    email: user.email,
    role: user.role,
    userName: user.userName,
  }));

  success(res, 200, result);
};

export const getAllTags: JwtAsyncFunction = async (req, res) => {
  const Data = await getAllTagsLogic();

  success(res, 200, Data);
};

export const getAllCourseCategories: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const categories = await getAllCourseCategoriesLogic();
  success(res, 200, categories);
};

export const createCourseCategory: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const { CategoryName } = req.body;
  const category = await createCourseCategoryLogic(CategoryName);
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
  const { id } = req.body;
  await deleteCourseCategoryLogic(id);
  success(res, 200);
};

export const editUserRole: JwtAsyncFunction = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  isAdmin(req);

  await editUserRoleLogic(id, userId);

  success(res, 200);
};

export const reviewCourse: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  const {
    id,
    title,
    teacher,
    content,
    price,
    originalPrice,
    videoKey,
    duration,
    fileName,
    reviewStatus,
    tagsKey,
  } = req.body;

  await reviewCourseLogic({
    id,
    title,
    teacher,
    content,
    price,
    originalPrice,
    fileName,
    videoKey,
    duration,
    reviewStatus,
    tagsKey,
  });

  success(res, 200);
};
