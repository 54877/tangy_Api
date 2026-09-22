import { getUserByIdLogic } from "../services/nav_services";
import { JwtAsyncFunction } from "../types/asyncType";
import { success } from "../utils/success";

export const getUser: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;

  const userDate = await getUserByIdLogic(id);

  success(res, 200, userDate);
};
