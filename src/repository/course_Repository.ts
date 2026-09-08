import prisma from "../db/prisma";

export const createCourseDb = async (
  title: string,
  teacher: string,
  price: string,
  originalPrice: string,
  fileName: string,
) => {
  await prisma.courseTable.create({
    data: {
      title,
      teacher,
      price,
      originalPrice,
      image: fileName,
    },
  });
};

export const getCourseDb = async () => {
  return await prisma.courseTable.findMany();
};
