import prisma from "../db/prisma";
import { CourseType } from "../types/profileType";

export const createCourseDb = async ({
  userId,
  title,
  teacher,
  content,
  price,
  originalPrice,
  fileName,
  videoKey,
  duration,
  tagsKey,
  categoryKey,
}: Omit<CourseType, "image" | "id" | "reviewStatus" | "tagsLabel">) => {
  await prisma.courseTable.create({
    data: {
      title,
      teacher,
      content,
      price,
      originalPrice,
      imageUrl: fileName,
      video: videoKey,
      duration,
      category: {
        connect: { categoryKey },
      },
      user: {
        connect: { id: userId },
      },
      courseTags: {
        create: tagsKey.map((key) => ({
          tagKey: Number(key),
        })),
      },
    },
  });
};

export const getCourseDb = async () => {
  return prisma.courseTable.findMany({
    include: {
      courseTags: {
        include: { tag: { select: { label: true } } },
      },
      category: { select: { CategoryName: true } },
    },
  });
};

export const getCourseForAdminDb = async () => {
  return prisma.courseTable.findMany({
    include: {
      courseTags: {
        include: { tag: { select: { label: true } } },
      },
      category: { select: { CategoryName: true } },
      user: { select: { userName: true, email: true } },
    },
  });
};
