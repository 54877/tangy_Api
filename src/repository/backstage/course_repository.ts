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
  categoryKey,
}: Omit<CourseType, "image" | "userId">) => {
  try {
    await prisma.courseTable.update({
      where: { id },
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
        category: {
          connect: { categoryKey },
        },
        courseTags: {
          deleteMany: {},
          create: [...new Set(tagsKey)].map((key) => ({
            tagKey: Number(key),
          })),
        },
      },
    });
  } catch (err: any) {
    if (err.code === "P2025") throw new AppError("課程不存在", 404);
    throw err;
  }
};
