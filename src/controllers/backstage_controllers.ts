import {
  createTagLogic,
  deleteTagLogic,
  editTagLogic,
  deleteCourseLogic,
  getAllUsersLogic,
  getAllTagsLogic,
  editUserRoleLogic,
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
  const { id } = req.body;

  isAdmin(req);

  await deleteTagLogic(Number(id));

  success(res, 200);
};

export const editTag: JwtAsyncFunction = async (req, res) => {
  const { id, label } = req.body;

  isAdmin(req);

  await editTagLogic(Number(id), label);

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

  isAdmin(req);

  await editUserRoleLogic(id);

  success(res, 200);
};
