import prisma from "../../db/prisma";
import { AppError } from "../../utils/errors";

export const getAllCourseCategoriesDb = async () =>
  prisma.courseCategoryTable.findMany({ orderBy: { createdAt: "asc" } });

export const createCourseCategoryDb = async (CategoryName: string) => {
  try {
    return await prisma.courseCategoryTable.create({ data: { CategoryName } });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new AppError("課程分類已存在", 409, "CategoryName");
    }
    throw err;
  }
};

export const editCourseCategoryDb = async (id: string, CategoryName: string) => {
  try {
    return await prisma.courseCategoryTable.update({
      where: { id },
      data: { CategoryName },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new AppError("課程分類已存在", 409, "CategoryName");
    }
    if (err.code === "P2025") throw new AppError("課程分類不存在", 404);
    throw err;
  }
};

export const deleteCourseCategoryDb = async (id: string) => {
  try {
    return await prisma.courseCategoryTable.delete({ where: { id } });
  } catch (err: any) {
    if (err.code === "P2025") throw new AppError("課程分類不存在", 404);
    throw err;
  }
};
