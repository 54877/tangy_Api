import { getUserByIdLogic } from "../services/nav_services";
import { JwtAsyncFunction } from "../types/asyncType";

export const getUser: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;

  const userDate = await getUserByIdLogic(id);

  res.status(200).json({
    userDate,
    message: "成功",
    state: true,
  });
};
