import {
  deviceCloseByIdLogic,
  deviceCloseByUserIdLogic,
  getPersonalByIdLogic,
  sendSVEmail,
  SV,
  svClose,
  updatePasswordLogic,
  updatePersonalByIdLogic,
  updateUserImageLogic,
} from "../services/profile_service";
import { JwtAsyncFunction } from "../types/asyncType";
import { success } from "../utils/success";

//個人資料
export const getPersonal: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;
  const deviceId = req.cookies.deviceId;
  const { userDate, genderSelect, device } = await getPersonalByIdLogic(id);
  const deviceDate = device.map((device) => ({
    ...device,
    isCurrent: device.id === deviceId,
  }));

  success(res, 200, { userDate, genderSelect, deviceDate });
};

//更新個人資料
export const updatePersonal: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;
  const { userName, gender, introduction, birthday } = req.body || {};
  await updatePersonalByIdLogic(id, userName, gender, introduction, birthday);

  success(res, 201, undefined, "更新成功");
};

//更新個人照片
export const updateUserImage: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;
  const image = req.file;

  await updateUserImageLogic(image, id);

  success(res, 201, undefined, "更新成功");
};

//變更密碼
export const updatePassword: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;
  const { newPassword, oldPassword } = req.body || {};
  await updatePasswordLogic(newPassword, oldPassword, id);

  success(res, 201, undefined, "更新成功");
};

//寄信
export const sendSVEmailControllers: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;
  const { email } = req.body || {};
  await sendSVEmail(id, email);

  success(res, 201, undefined, "email已寄出");
};

//sv開啟
export const svControllers: JwtAsyncFunction = async (req, res) => {
  const { email, code } = req.body || {};
  await SV(email, code);

  success(res, 201, undefined, "成功開啟2FA");
};

//sv關閉
export const svCloseControllers: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;
  await svClose(id);

  success(res, 201, undefined, "成功關閉2FA");
};

//登出device by id
export const deviceCloseByIdControllers: JwtAsyncFunction = async (
  req,
  res,
) => {
  const { id } = req.body || {};

  await deviceCloseByIdLogic(id);

  success(res, 201, undefined, "成功關閉device");
};

//登出所有device by id
export const deviceCloseByUserIdControllers: JwtAsyncFunction = async (
  req,
  res,
) => {
  const { userId } = req.body || {};

  await deviceCloseByUserIdLogic(userId);

  success(res, 201, undefined, "成功關閉device");
};
