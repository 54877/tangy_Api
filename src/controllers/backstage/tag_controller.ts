import {
  createTagLogic,
  deleteTagLogic,
  editTagLogic,
  getAllTagsLogic,
} from "../../services/backstage/tag_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { isAdmin } from "../../utils/role";
import { success } from "../../utils/success";

export const createTag: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  await createTagLogic(req.body.label);
  success(res, 200);
};

export const deleteTag: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  await deleteTagLogic(Number(req.body.key));
  success(res, 200);
};

export const editTag: JwtAsyncFunction = async (req, res) => {
  isAdmin(req);
  await editTagLogic(Number(req.body.key), req.body.label);
  success(res, 200);
};

export const getAllTags: JwtAsyncFunction = async (_req, res) => {
  success(res, 200, await getAllTagsLogic());
};
