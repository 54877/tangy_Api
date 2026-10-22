import {
  createTagDb,
  deleteTagByIdDb,
  editTagDb,
  getAllTagsDb,
} from "../../repository/backstage/tag_repository";

export const createTagLogic = (label: string) => createTagDb(label);
export const deleteTagLogic = (key: number) => deleteTagByIdDb(key);
export const editTagLogic = (key: number, label: string) => editTagDb(key, label);

export const getAllTagsLogic = async () => {
  const tags = await getAllTagsDb();
  return tags.map((tag) => ({ ...tag, key: String(tag.key) }));
};
