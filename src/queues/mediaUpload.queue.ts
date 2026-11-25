import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis.js";

export type MediaVerificationJob = {
  uploadId: string;
};

export const mediaUploadQueue = new Queue<MediaVerificationJob>(
  "media-upload-verification",
  {
    connection: createRedisConnection(),
  },
);
