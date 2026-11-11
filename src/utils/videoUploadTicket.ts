import jwt, { JwtPayload } from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { createVideoUploadTicketDb } from "../repository/common/video_upload_ticket_repository";
import { AppError } from "./errors";

const TICKET_TTL_SECONDS = 15 * 60;
const TICKET_PURPOSE = "course-video-upload";

const getTicketSecret = () => {
  const secret = process.env.VIDEO_UPLOAD_TICKET_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "VIDEO_UPLOAD_TICKET_SECRET must be at least 32 characters",
    );
  }
  return secret;
};

export const issueVideoUploadTicket = async (
  userId: string,
  videoKey: string,
  duration: string,
) => {
  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + TICKET_TTL_SECONDS * 1000);
  const token = jwt.sign(
    { purpose: TICKET_PURPOSE, videoKey, duration },
    getTicketSecret(),
    {
      algorithm: "HS256",
      subject: userId,
      jwtid: jti,
      expiresIn: TICKET_TTL_SECONDS,
    },
  );

  await createVideoUploadTicketDb({
    jti,
    userId,
    videoKey,
    duration,
    expiresAt,
  });

  return token;
};

export const verifyVideoUploadTicket = (
  token: string,
  userId: string,
  videoKey: string,
  duration: string,
) => {
  try {
    const payload = jwt.verify(token, getTicketSecret(), {
      algorithms: ["HS256"],
    }) as JwtPayload & {
      purpose?: string;
      videoKey?: string;
      duration?: string;
    };

    if (
      payload.purpose !== TICKET_PURPOSE ||
      payload.sub !== userId ||
      !payload.jti ||
      payload.videoKey !== videoKey ||
      payload.duration !== duration
    ) {
      throw new AppError("影片上傳憑證與影片資料不符", 400);
    }

    return { jti: payload.jti, videoKey, duration };
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (
      error instanceof Error &&
      error.message.includes("VIDEO_UPLOAD_TICKET_SECRET")
    ) {
      throw error;
    }
    throw new AppError("影片上傳憑證無效或已過期", 400);
  }
};
