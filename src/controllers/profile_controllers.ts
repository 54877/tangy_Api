import { getPersonalByIdLogic } from "../services/profile_router";
import { JwtAsyncFunction } from "../types/asyncType";

//個人資料
export const getPersonal: JwtAsyncFunction = async (req, res) => {
  const id = req.user?.id;

  const { userDate, genderSelect } = await getPersonalByIdLogic(id);

  res.status(200).json({
    userDate,
    genderSelect,
    message: "成功",
    state: true,
  });
};
