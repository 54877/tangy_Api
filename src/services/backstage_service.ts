import {
  createTagDb,
  deleteCourseByIdDb,
  deleteTagByIdDb,
  editTagDb,
  getCourseByIdDb,
} from "../repository/backstage_Repository";
import { deleteCourseFile } from "../utils/removeSupabaseStorage";

//建立tag
export const createTagLogic = async (label: string) => {
  await createTagDb(label);
};

//刪除tag
export const deleteTagLogic = async (id: number) => {
  await deleteTagByIdDb(id);
};

//編輯tag
export const editTagLogic = async (id: number, label: string) => {
  await editTagDb(id, label);
};

//刪除課程
export const deleteCourseLogic = async (id: string) => {
  const course = await getCourseByIdDb(id);

  if (!course) {
    throw new Error("課程不存在");
  }

  try {
    await deleteCourseByIdDb(id);
  } catch (err) {
    throw new Error("刪除課程失敗");
  }

  await Promise.all([
    deleteCourseFile("course", course.video),
    deleteCourseFile("course", course.imageUrl),
  ]);
};
