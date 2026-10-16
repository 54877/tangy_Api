import {
  createTagDb,
  deleteCourseByIdDb,
  deleteTagByIdDb,
  editTagDb,
  editUserRoleDb,
  getAllTagsDb,
  getAllUsersDb,
  getCourseByIdDb,
} from "../repository/backstage_Repository";
import { getUserById } from "../repository/nav_Repository";
import { deleteCourseFile } from "../utils/removeSupabaseStorage";
import { AppError } from "../utils/errors";

//建立tag
export const createTagLogic = async (label: string) => {
  await createTagDb(label);
};

//刪除tag
export const deleteTagLogic = async (key: number) => {
  await deleteTagByIdDb(key);
};

//編輯tag
export const editTagLogic = async (key: number, label: string) => {
  await editTagDb(key, label);
};

//刪除課程
export const deleteCourseLogic = async (id: string) => {
  const course = await getCourseByIdDb(id);

  if (!course) {
    throw new AppError("課程不存在", 404);
  }

  try {
    await deleteCourseByIdDb(id);
  } catch (err) {
    throw new AppError("刪除課程失敗", 500);
  }

  await Promise.all([
    deleteCourseFile("video", course.video),
    deleteCourseFile("course", course.imageUrl),
  ]);
};

export const getAllUsersLogic = async () => {
  const users = await getAllUsersDb();

  return users;
};

export const getAllTagsLogic = async () => {
  const tagList = (await getAllTagsDb()).map((tag) => ({
    ...tag,
    key: String(tag.key),
  }));
  return tagList;
};

export const editUserRoleLogic = async (id: string) => {
  const user = await getUserById(id);

  await editUserRoleDb(id, user?.role === "user" ? "admin" : "user");
};
