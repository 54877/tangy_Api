import { getUserById } from "../repository/nav_Repository";
import { AppError } from "../utils/errors";
import { getCourseImageUrl } from "../utils/getCourseImageUrl";

//get user (nav)
export const getUserByIdLogic = async (id: string | undefined) => {
  if (!id) {
    throw new AppError("未登入", 401);
  }

  const user = await getUserById(id);

  if (!user) {
    throw new AppError("查無資料", 400);
  }

  //取得image url加入dataList
  const result = await getCourseImageUrl(user, "userImg");

  return {
    id: result.id,
    email: result.email,
    userName: result.userName,
    imageUrl: result.imageUrl,
    svType: result.svType,
    role: result.role,
  };
};
