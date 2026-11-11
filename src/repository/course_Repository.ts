import prisma from "../db/prisma";
import { CourseType } from "../types/profileType";
import { deleteVideoUploadTicket } from "./common/video_upload_ticket_repository";

export const createCourseDb = async ({
  userId,
  title,
  teacher,
  content,
  price,
  originalPrice,
  fileName,
  videoKey,
  duration,
  videoUploadTicketJti,
  tagsKey,
  categoryKey,
}: Omit<CourseType, "image" | "id" | "reviewStatus" | "tagsLabel"> & {
  videoUploadTicketJti: string;
}) => {
  await prisma.$transaction(async (tx) => {
    await deleteVideoUploadTicket(
      { jti: videoUploadTicketJti, userId, videoKey },
      { tx, required: true },
    );

    await tx.courseTable.create({
      data: {
        title,
        teacher,
        content,
        price,
        originalPrice,
        imageUrl: fileName,
        video: videoKey,
        tagsKey,
        duration,
        category: {
          connect: { categoryKey },
        },
        user: {
          connect: { id: userId },
        },
        courseTags: {
          create: tagsKey.map((key) => ({
            tagKey: Number(key),
          })),
        },
      },
    });
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

export const getCourseForAdminDb = async () => {
  return prisma.courseTable.findMany({
    select: {
      id: true,
      title: true,
      originalPrice: true,
      price: true,
      rating: true,
      studentCount: true,
      reviewStatus: true,
      reviewContext: true,
      reviewCount: true,
      courseTags: {
        select: { tag: { select: { label: true } } },
      },
      category: { select: { CategoryName: true } },
      user: { select: { userName: true } },
    },
  });
};
