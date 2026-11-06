import prisma from "../../db/prisma";

// Options used by the course creation form.
export const getCourseFormOptionsDb = async () => {
  const [tags, categories] = await Promise.all([
    prisma.tagsTable.findMany({
      select: { key: true, label: true },
      orderBy: { key: "asc" },
    }),
    prisma.courseCategoryTable.findMany({
      select: { categoryKey: true, CategoryName: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return {
    tags: tags.map((tag) => ({ ...tag, key: String(tag.key) })),
    categories,
  };
};

export const getMyCourseDb = async (userId: string) => {
  const courses = await prisma.courseTable.findMany({
    where: { userId },
    select: {
      title: true,
      teacher: true,
      rating: true,
      studentCount: true,
      duration: true,
      price: true,
      originalPrice: true,
      reviewContext: true,
      reviewStatus: true,
      reviewCount: true,
      courseTags: {
        select: { tag: { select: { label: true } } },
      },
      category: { select: { CategoryName: true } },
    },
  });

  return courses.map(({ category, courseTags, ...course }) => ({
    ...course,
    courseTags: courseTags.map(({ tag }) => tag.label),
    category: category?.CategoryName ?? null,
  }));
};
