import prisma from "../db/prisma";
import { MediaUploadStatus } from "@prisma/client";

export type CreateMediaUploadInput = {
  uploadId: string;
  bucket: string;
  path: string;
  expectedSize: bigint;
  contentType: string;
  method: "standard" | "tus";
  expiresAt: Date;
};

export const createMediaUploadDb = async (input: CreateMediaUploadInput) =>
  await prisma.mediaUploadTable.create({
    data: {
      ...input,
      status: MediaUploadStatus.PENDING_UPLOAD,
    },
  });

export const mediaUploadVideo = async (uploadId: string) => {
  return prisma.mediaUploadTable.findUnique({ where: { uploadId } });
};

export const updateMediaUploadState = async (
  uploadId: string,
  status: MediaUploadStatus,
) => {
  return prisma.mediaUploadTable.updateMany({
    where: { uploadId, status: MediaUploadStatus.PENDING_UPLOAD },
    data: { status },
  });
};

export const updateMediaUploadVerification = async (
  uploadId: string,
  status: MediaUploadStatus,
) =>
  prisma.mediaUploadTable.updateMany({
    where: {
      uploadId,
      status: {
        in: [
          MediaUploadStatus.PENDING_VERIFICATION,
          MediaUploadStatus.VERIFYING,
        ],
      },
    },
    data: { status },
  });
