import {
  deviceCloseById,
  deviceCloseByUserId,
} from "../../repository/profile/profile_device_repository";

//刪除裝置 by id
export const deviceCloseByIdLogic = async (id: string) => {
  await deviceCloseById(id);
};

//刪除裝置 by userId
export const deviceCloseByUserIdLogic = async (userId: string) => {
  await deviceCloseByUserId(userId);
};
