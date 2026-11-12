import prisma from "../../db/prisma";

export const createFavoriteCourseDb = async (
  userId: string,
  courseId: string,
) =>
  prisma.favoriteCourseTable.createMany({
    data: { userId, courseId },
    skipDuplicates: true,
  });

export const getApprovedCourseDb = (courseId: string) =>
  prisma.courseTable.findFirst({
    where: { id: courseId, reviewStatus: "APPROVED" },
    select: { id: true },
  });

export const deleteFavoriteCourseDb = (userId: string, courseId: string) =>
  prisma.favoriteCourseTable.deleteMany({ where: { userId, courseId } });

export const getMyFavoriteCoursesDb = (userId: string) =>
  prisma.favoriteCourseTable.findMany({
    where: { userId, course: { reviewStatus: "APPROVED" } },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      course: {
        select: {
          id: true,
          title: true,
          teacher: true,
          duration: true,
          price: true,
          category: { select: { CategoryName: true } },
        },
      },
    },
  });
