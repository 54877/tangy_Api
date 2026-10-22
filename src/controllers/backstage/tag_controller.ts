import {
  createTagLogic,
  deleteTagLogic,
  editTagLogic,
  getAllTagsLogic,
} from "../../services/backstage/tag_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { success } from "../../utils/success";

export const createTag: JwtAsyncFunction = async (req, res) => {
  await createTagLogic(req.body.label);
  success(res, 200);
};

export const deleteTag: JwtAsyncFunction = async (req, res) => {
  await deleteTagLogic(Number(req.body.key));
  success(res, 200);
};

export const editTag: JwtAsyncFunction = async (req, res) => {
  await editTagLogic(Number(req.body.key), req.body.label);
  success(res, 200);
};

export const getAllTags: JwtAsyncFunction = async (_req, res) => {
  success(res, 200, await getAllTagsLogic());
};
