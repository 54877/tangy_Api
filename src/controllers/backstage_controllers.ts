import {
  createTagLogic,
  deleteTagLogic,
  editTagLogic,
  deleteCourseLogic,
  getAllUsersLogic,
  getAllTagsLogic,
  editUserRoleLogic,
  reviewCourseLogic,
} from "../services/backstage_service";
import { JwtAsyncFunction } from "../types/asyncType";
import { isAdmin } from "../utils/role";
import { success } from "../utils/success";

export const createTag: JwtAsyncFunction = async (req, res) => {
  const { label } = req.body;
  console.log(isAdmin(req));

  isAdmin(req);

  await createTagLogic(label);

  success(res, 200);
};

export const deleteTag: JwtAsyncFunction = async (req, res) => {
  const { key } = req.body;

  isAdmin(req);

  await deleteTagLogic(Number(key));

  success(res, 200);
};

export const editTag: JwtAsyncFunction = async (req, res) => {
  const { key, label } = req.body;

  isAdmin(req);

  await editTagLogic(Number(key), label);

  success(res, 200);
};

export const deleteCourse: JwtAsyncFunction = async (req, res) => {
  const { id } = req.body;

  isAdmin(req);
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

export const editUserRole: JwtAsyncFunction = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  isAdmin(req);

  await editUserRoleLogic(id, userId);

  success(res, 200);
};

export const reviewCourse: JwtAsyncFunction = async (req, res) => {
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
