import prisma from "../../db/prisma";
import { CourseType } from "../../types/profileType";
import { AppError } from "../../utils/errors";

export const deleteCourseByIdDb = async (id: string) => {
  try {
    return await prisma.courseTable.delete({ where: { id } });
  } catch (err: any) {
    if (err.code === "P2025") throw new AppError("課程不存在", 404);
    throw err;
  }
};

export const getCourseByIdDb = async (id: string) =>
  prisma.courseTable.findUnique({ where: { id } });

export const getCourseDetailByIdDb = async (id: string) =>
  prisma.courseTable.findUnique({
    where: { id },
    include: {
      courseTags: { select: { tag: { select: { label: true } } } },
      category: { select: { CategoryName: true } },
      user: { select: { userName: true } },
    },
  });

export const getCourseTagKeysByIdDb = async (id: string) =>
  prisma.courseTable.findUnique({
    where: { id },
    select: { courseTags: { select: { tagKey: true } } },
  });

export const reviewCourseStatusDb = async (
  id: string,
  reviewStatus: CourseType["reviewStatus"],
) => {
  try {
    await prisma.courseTable.update({
      where: { id },
      data: { reviewStatus },
    });
  } catch (err: any) {
    if (err.code === "P2025") throw new AppError("課程不存在", 404);
    throw err;
  }
};
