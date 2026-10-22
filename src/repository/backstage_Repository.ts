import prisma from "../db/prisma";
import { CourseType } from "../types/profileType";
import { AppError } from "../utils/errors";

export const createTagDb = async (label: string) => {
  try {
    return await prisma.tagsTable.create({
      data: {
        label,
        createdAt: new Date(),
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

export const deleteTagByIdDb = async (key: number) => {
  try {
    return await prisma.tagsTable.delete({
      where: {
        key,
      },
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new AppError("標籤不存在", 404);
    }
    throw err;
  }
};

export const editTagDb = async (key: number, label: string) => {
  try {
    return await prisma.tagsTable.update({
      where: {
        key,
      },
      data: {
        label,
        createdAt: new Date(),
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new AppError("標籤已存在", 409, "label");
    }
    if (err.code === "P2025") {
      throw new AppError("標籤不存在", 404);
    }
    throw err;
  }
};

export const deleteCourseByIdDb = async (id: string) => {
  try {
    return await prisma.courseTable.delete({
      where: {
        id,
      },
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new AppError("課程不存在", 404);
    }
    throw err;
  }
};

export const getCourseByIdDb = async (id: string) => {
  return await prisma.courseTable.findUnique({
    where: {
      id,
    },
  });
};

export const getAllUsersDb = async () => {
  return await prisma.user.findMany();
};

export const getAllTagsDb = async () => {
  return await prisma.tagsTable.findMany();
};

export const getAllCourseCategoriesDb = async () =>
  prisma.courseCategoryTable.findMany({ orderBy: { createdAt: "asc" } });

export const createCourseCategoryDb = async (CategoryName: string) => {
  try {
    return await prisma.courseCategoryTable.create({ data: { CategoryName } });
  } catch (err: any) {
    if (err.code === "P2002") throw new AppError("課程分類已存在", 409, "CategoryName");
    throw err;
  }
};

export const editCourseCategoryDb = async (id: string, CategoryName: string) => {
  try {
    return await prisma.courseCategoryTable.update({ where: { id }, data: { CategoryName } });
  } catch (err: any) {
    if (err.code === "P2002") throw new AppError("課程分類已存在", 409, "CategoryName");
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

export const editUserRoleDb = async (id: string, role: string) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });
};

export const reviewCourseLogicDb = async ({
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
  try {
    await prisma.courseTable.update({
      where: {
        id,
      },
      data: {
        title,
        teacher,
        content,
        price,
        originalPrice,
        imageUrl: fileName,
        video: videoKey,
        duration,
        reviewStatus,
        tagsKey,
      },
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new AppError("課程不存在", 404);
    }
    throw err;
  }
};
