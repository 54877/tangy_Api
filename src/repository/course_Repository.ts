import prisma from "../db/prisma";
import { CourseType } from "../types/profileType";

export const createCourseDb = async ({
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
}: Omit<CourseType, "image" | "id" | "reviewStatus" | "tagsLabel"> & {
  categoryKey: string;
}) => {
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
