import {
  createTagDb,
  deleteCourseByIdDb,
  deleteTagByIdDb,
  editTagDb,
} from "../repository/backstage_Repository";

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
  await deleteCourseByIdDb(id);
};
