import { getUserByIdLogic } from "../services/profile_services";
import { JwtAsyncFunction } from "../types/asyncType";

export const getUser: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;

  const userDate = await getUserByIdLogic(id);

  res.status(201).json({
    userDate,
    message: "登入成功",
    state: true,
  });
};
