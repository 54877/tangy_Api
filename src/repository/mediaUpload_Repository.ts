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

export const createMediaUploadDb = (input: CreateMediaUploadInput) =>
  prisma.mediaUploadTable.create({
    data: {
      ...input,
      status: MediaUploadStatus.PENDING_UPLOAD,
    },
  });
