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
}: Omit<CourseType, "image">) => {
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
    },
  });
};

export const getCourseDb = async () => {
  return await prisma.courseTable.findMany();
};
