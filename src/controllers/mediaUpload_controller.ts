import {
  checkCompleteLogic,
  getUploadTokenLogic,
} from "../services/mediaUpload_service";
import { JwtAsyncFunction } from "../types/asyncType";
import { success } from "../utils/success";

export const getToken: JwtAsyncFunction = async (req, res) => {
  const { size, contentType } = req.body;

  const result = await getUploadTokenLogic({
    size,
    contentType,
  });

  success(res, 200, result);
};

export const checkComplete: JwtAsyncFunction = async (req, res) => {
  const { uploadId } = req.body;

  const result = await checkCompleteLogic(uploadId);
  success(res, 200, result);
};
