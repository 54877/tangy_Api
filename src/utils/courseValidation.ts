import { getCourseCategoryByKeyDb } from "../repository/backstage/category_repository";
import { getTagsByKeysDb } from "../repository/backstage/tag_repository";
import { AppError } from "./errors";
import { sanitizeCourseContent } from "./sanitizeCourseContent";

export const validateCourseFields = async ({
  price,
  originalPrice,
  content,
  tagsKey,
  categoryKey,
}: {
  price: string;
  originalPrice: string;
  content: string;
  tagsKey: string[];
  categoryKey: string;
}) => {
  if (Number(price) > Number(originalPrice)) {
    throw new AppError("價格不可高於原價", 400, "price");
  }

  const category = await getCourseCategoryByKeyDb(categoryKey);
  if (!category) {
    throw new AppError("課程分類不存在", 400, "categoryKey");
  }

  const tagKeys = [...new Set(tagsKey.map(Number))];
  if (tagKeys.some((key) => !Number.isSafeInteger(key))) {
    throw new AppError("包含不存在的標籤", 400, "tagsKey");
  }

  const existingTags = await getTagsByKeysDb(tagKeys);
  if (existingTags.length !== tagKeys.length) {
    throw new AppError("包含不存在的標籤", 400, "tagsKey");
  }

  return {
    tagKeys,
    sanitizedContent: sanitizeCourseContent(content),
  };
};
