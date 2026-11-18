import prisma from "../db/prisma";

export const getCourseDb = async () => {
  return prisma.courseTable.findMany({
    where: { reviewStatus: "APPROVED" },
    include: {
      courseTags: {
        include: { tag: { select: { label: true } } },
      },
      category: { select: { CategoryName: true } },
    },
  });
};

export const searchCourseDb = async (
  context?: string,
  categoryKey?: string[],
) => {
  const keyword = context?.trim();

  return prisma.courseTable.findMany({
    where: {
      reviewStatus: "APPROVED",
      ...(categoryKey?.length ? { categoryKey: { in: categoryKey } } : {}),
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: "insensitive" } },
              { teacher: { contains: keyword, mode: "insensitive" } },
              {
                courseTags: {
                  some: {
                    tag: { label: { contains: keyword, mode: "insensitive" } },
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      courseTags: {
        include: { tag: { select: { label: true } } },
      },
      category: { select: { CategoryName: true } },
    },
  });
};
