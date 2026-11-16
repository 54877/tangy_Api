import { getUserById } from "../repository/nav_Repository";
import { getAllCourseCategoriesDb } from "../repository/backstage/backStage_category_repository";
import { AppError } from "../utils/errors";
import { getStorageUrl } from "../utils/supabase/getStorageUrl";

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
  const result = await getStorageUrl(user, "userImg", "image");
  const categoryList = await getAllCourseCategoriesDb();

  return {
    id: result.id,
    email: result.email,
    userName: result.userName,
    imageUrl: result.imageUrl,
    svType: result.svType,
    role: result.role,
    categoryList: categoryList.map(({ categoryKey, CategoryName }) => ({
      categoryKey,
      CategoryName,
    })),
  };
};
