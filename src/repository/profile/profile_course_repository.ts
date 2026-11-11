import prisma from "../../db/prisma";
import { deleteVideoUploadTicket } from "../common/video_upload_ticket_repository";

export const updateMyCourseForReviewDb = async ({
  id,
  userId,
  title,
  teacher,
  content,
  price,
  originalPrice,
  imageUrl,
  video,
  duration,
  videoUploadTicketJti,
  tagsKey,
  categoryKey,
}: {
  id: string;
  userId: string;
  title: string;
  teacher: string;
  content: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  video: string;
  duration: string;
  videoUploadTicketJti?: string;
  tagsKey: string[];
  categoryKey: string;
}) =>
  prisma.$transaction(async (tx) => {
    const course = await tx.courseTable.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!course) return null;

    if (videoUploadTicketJti) {
      await deleteVideoUploadTicket(
        { jti: videoUploadTicketJti, userId, videoKey: video },
        { tx, required: true },
      );
    }

    return tx.courseTable.update({
      where: { id },
      data: {
        title,
        teacher,
        content,
        price,
        originalPrice,
        imageUrl,
        video,
        duration,
        reviewStatus: "PENDING",
        category: { connect: { categoryKey } },
        courseTags: {
          deleteMany: {},
          create: tagsKey.map((key) => ({ tagKey: Number(key) })),
        },
        tagsKey,
      },
    });
  });

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
      id: true,
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

  return courses.map(({ category, ...course }) => ({
    ...course,
    category: category?.CategoryName ?? null,
  }));
};

export const getMyCourseDetailByIdDb = async (id: string, userId: string) =>
  prisma.courseTable.findFirst({
    where: { id, userId },
    include: {
      courseTags: {
        select: { tag: { select: { label: true } } },
      },
      category: { select: { CategoryName: true } },
    },
  });
