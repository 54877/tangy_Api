import {
  createTagLogic,
  deleteTagLogic,
  editTagLogic,
} from "../services/backstage_service";
import { JwtAsyncFunction } from "../types/asyncType";
import { success } from "../utils/success";

export const createTag: JwtAsyncFunction = async (req, res) => {
  const { label } = req.body;

  await createTagLogic(label);

  success(res, 200);
};

export const deleteTag: JwtAsyncFunction = async (req, res) => {
  const { id } = req.body;

  await deleteTagLogic(Number(id));

  success(res, 200);
};

export const editTag: JwtAsyncFunction = async (req, res) => {
  const { id, label } = req.body;

  await editTagLogic(Number(id), label);

  success(res, 200);
};
