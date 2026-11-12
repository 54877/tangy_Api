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
