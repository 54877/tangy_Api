import prisma from "../../db/prisma";
import { AppError } from "../../utils/errors";

type TransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

export type VideoUploadTicketValues = {
  jti: string;
  userId: string;
  videoKey: string;
  duration: string;
};

export const createVideoUploadTicketDb = async ({
  jti,
  userId,
  videoKey,
  duration,
  expiresAt,
}: VideoUploadTicketValues & { expiresAt: Date }) => {
  await prisma.courseVideoUploadTicketTable.create({
    data: { jti, userId, videoKey, duration, expiresAt },
  });
};

export const deleteVideoUploadTicket = async (
  {
    jti,
    userId,
    videoKey,
  }: Pick<VideoUploadTicketValues, "jti" | "userId" | "videoKey">,
  { tx, required = false }: { tx?: TransactionClient; required?: boolean } = {},
) => {
  const where = { jti, userId, videoKey };
  const result = tx
    ? await tx.courseVideoUploadTicketTable.deleteMany({ where })
    : await prisma.courseVideoUploadTicketTable.deleteMany({ where });

  const deleted = result.count === 1;
  if (required && !deleted) {
    throw new AppError("影片上傳憑證無效、已過期或已使用", 400, "videoTicket");
  }
  return deleted;
};
