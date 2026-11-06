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
