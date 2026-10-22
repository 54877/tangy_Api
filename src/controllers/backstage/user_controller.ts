import {
  editUserRoleLogic,
  getAllUsersLogic,
} from "../../services/backstage/user_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { success } from "../../utils/success";

export const getAllUsers: JwtAsyncFunction = async (req, res) => {
  const users = await getAllUsersLogic();
  success(
    res,
    200,
    users.map((user) => ({
      id: user.id,
      createdAt: user.createdAt,
      email: user.email,
      role: user.role,
      userName: user.userName,
    })),
  );
};

export const editUserRole: JwtAsyncFunction = async (req, res) => {
  await editUserRoleLogic(req.body.id, req.user.id);
  success(res, 200);
};
