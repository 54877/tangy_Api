import {
  deviceCloseByIdLogic,
  deviceCloseByUserIdLogic,
} from "../../services/profile/profile_device_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { success } from "../../utils/success";

export const deviceCloseByIdControllers: JwtAsyncFunction = async (
  req,
  res,
) => {
  const { id } = req.body || {};
  await deviceCloseByIdLogic(id);
  success(res, 201);
};

export const deviceCloseByUserIdControllers: JwtAsyncFunction = async (
  req,
  res,
) => {
  const { userId } = req.body || {};
  await deviceCloseByUserIdLogic(userId);
  success(res, 201);
};
