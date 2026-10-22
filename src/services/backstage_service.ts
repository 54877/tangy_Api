import {
  createCourseCategoryDb,
  createTagDb,
  deleteCourseCategoryDb,
  deleteCourseByIdDb,
  deleteTagByIdDb,
  editTagDb,
  editCourseCategoryDb,
  editUserRoleDb,
  getAllTagsDb,
  getAllCourseCategoriesDb,
  getAllUsersDb,
  getCourseByIdDb,
  reviewCourseLogicDb,
} from "../repository/backstage_Repository";
import { getUserById } from "../repository/nav_Repository";
import { deleteCourseFile } from "../utils/removeSupabaseStorage";
import { AppError } from "../utils/errors";
import { CourseType } from "../types/profileType";
import { sanitizeCourseContent } from "../utils/sanitizeCourseContent";

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

export const getAllCourseCategoriesLogic = async () => {
  return await getAllCourseCategoriesDb();
};

export const createCourseCategoryLogic = async (CategoryName: string) =>
  createCourseCategoryDb(CategoryName);

export const editCourseCategoryLogic = async (id: string, CategoryName: string) =>
  editCourseCategoryDb(id, CategoryName);

export const deleteCourseCategoryLogic = async (id: string) =>
  deleteCourseCategoryDb(id);

//刪除課程
export const deleteCourseLogic = async (id: string) => {
  const course = await getCourseByIdDb(id);

  if (!course) {
    throw new AppError("課程不存在", 404);
  }

  try {
    await deleteCourseByIdDb(id);
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
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

export const editUserRoleLogic = async (id: string, userId: string) => {
  if (id === userId) {
    throw new AppError("不可修改自己權限", 403);
  }

  const user = await getUserById(id);

  await editUserRoleDb(id, user?.role === "user" ? "admin" : "user");
};

export const reviewCourseLogic = async ({
  id,
  title,
  teacher,
  content,
  price,
  originalPrice,
  fileName,
  videoKey,
  duration,
  reviewStatus,
  tagsKey,
}: Omit<CourseType, "image">) => {
  const sanitizedContent = sanitizeCourseContent(content);

  //執行Db
  await reviewCourseLogicDb({
    id,
    title,
    teacher,
    content: sanitizedContent,
    price,
    originalPrice,
    fileName,
    videoKey,
    duration,
    reviewStatus,
    tagsKey,
  });
};
