import { Worker } from "bullmq";
import { randomUUID } from "node:crypto";
import { writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRedisConnection } from "../config/redis.js";
import { supabase } from "../config/supabase.js";
import {
  mediaUploadVideo,
  updateMediaUploadVerification,
} from "../repository/mediaUpload_Repository.js";
import { MediaUploadStatus } from "@prisma/client";
import { AppError } from "../utils/errors.js";
import type { MediaVerificationJob } from "../queues/mediaUpload.queue.js";
import { validateVideoFile } from "../utils/video/videoValidation.js";

export const mediaUploadWorker = new Worker<MediaVerificationJob>(
  "media-upload-verification",
  async (job) => {
    const { uploadId } = job.data;

    console.log(`收到影片驗證工作：${uploadId}`);

    const upload = await mediaUploadVideo(uploadId);
    if (!upload) throw new Error("找不到上傳紀錄");

    if (upload.status === MediaUploadStatus.READY) {
      return { uploadId, status: upload.status };
    }

    if (
      upload.status !== MediaUploadStatus.PENDING_VERIFICATION &&
      upload.status !== MediaUploadStatus.VERIFYING
    ) {
      throw new Error(`目前狀態不可驗證：${upload.status}`);
    }

    await updateMediaUploadVerification(uploadId, MediaUploadStatus.VERIFYING);

    try {
      const { data, error } = await supabase.storage
        .from(upload.bucket)
        .download(upload.path);
      if (error || !data) throw new Error("下載影片失敗");

      const extension = upload.contentType === "video/mp4" ? ".mp4" : ".webm";
      const tempPath = join(tmpdir(), `${randomUUID()}${extension}`);

      try {
        await writeFile(tempPath, Buffer.from(await data.arrayBuffer()));
        const duration = await validateVideoFile(tempPath, upload.contentType);

        await updateMediaUploadVerification(uploadId, MediaUploadStatus.READY);
        return { uploadId, status: MediaUploadStatus.READY, duration };
      } finally {
        await rm(tempPath, { force: true });
      }
    } catch (error) {
      if (error instanceof AppError && error.field === "video") {
        await updateMediaUploadVerification(uploadId, MediaUploadStatus.FAILED);
      }
      throw error;
    }
  },
  {
    connection: createRedisConnection(),
  },
);

mediaUploadWorker.on("completed", (job) => {
  console.log(`影片驗證工作完成：${job.id}`);
});

mediaUploadWorker.on("failed", (job, error) => {
  console.error(`影片驗證工作失敗：${job?.id}`, error);
});

mediaUploadWorker.on("error", (error) => {
  console.error("影片驗證 Worker 發生錯誤：", error);
});
