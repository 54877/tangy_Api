import prisma from "../../db/prisma";
import { AppError } from "../../utils/errors";

export const createTagDb = async (label: string) => {
  try {
    return await prisma.tagsTable.create({ data: { label } });
  } catch (err: any) {
    if (err.code === "P2002") throw new AppError("標籤已存在", 400, "label");
    throw err;
  }
};

export const deleteTagByIdDb = async (key: number) => {
  try {
    return await prisma.tagsTable.delete({ where: { key } });
  } catch (err: any) {
    if (err.code === "P2025") throw new AppError("標籤不存在", 404);
    throw err;
  }
};

export const editTagDb = async (key: number, label: string) => {
  try {
    return await prisma.tagsTable.update({
      where: { key },
      data: { label, createdAt: new Date() },
    });
  } catch (err: any) {
    if (err.code === "P2002") throw new AppError("標籤已存在", 409, "label");
    if (err.code === "P2025") throw new AppError("標籤不存在", 404);
    throw err;
  }
};

export const getAllTagsDb = async () => prisma.tagsTable.findMany();

export const getTagsByKeysDb = (keys: number[]) =>
  prisma.tagsTable.findMany({
    where: { key: { in: keys } },
    select: { key: true },
  });
