import prisma from "../db/prisma";
import { AppError } from "../utils/errors";

export const createTagDb = async (label: string) => {
  try {
    return await prisma.tagsTable.create({
      data: {
        label,
      },
    });
  } catch (err: any) {
    // Prisma unique error
    if (err.code === "P2002") {
      throw new AppError("標籤已存在", 400, "label");
    }
    throw err;
  }
};

export const deleteTagByIdDb = async (id: number) => {
  return await prisma.tagsTable.delete({
    where: {
      id,
    },
  });
};

export const editTagDb = async (id: number, label: string) => {
  return await prisma.tagsTable.update({
    where: {
      id,
    },
    data: {
      label,
    },
  });
};

export const deleteCourseByIdDb = async (id: string) => {
  return await prisma.courseTable.delete({
    where: {
      id,
    },
  });
};

export const getCourseByIdDb = async (id: string) => {
  return await prisma.courseTable.findUnique({
    where: {
      id,
    },
  });
};
