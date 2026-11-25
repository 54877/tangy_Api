import { randomUUID } from "node:crypto";
import { MediaUploadStatus } from "@prisma/client";
import { supabase } from "../config/supabase";
import {
  createMediaUploadDb,
  mediaUploadVideo,
  updateMediaUploadState,
} from "../repository/mediaUpload_Repository";
import { AppError } from "../utils/errors";

type GetUploadTokenInput = {
  size: number;
  contentType: "video/mp4" | "video/webm";
};

const TUS_BYTES = 6 * 1024 * 1024;
const CHUNK_SIZE = 6 * 1024 * 1024;
const VIDEO_BUCKET = "videos";
const STANDARD_UPLOAD_TTL_MS = 2 * 60 * 60 * 1000;
const TUS_UPLOAD_TTL_MS = 24 * 60 * 60 * 1000;

export const getUploadTokenLogic = async (input: GetUploadTokenInput) => {
  const uploadId = randomUUID();
  const extension = input.contentType === "video/mp4" ? "mp4" : "webm";
  const path = `video/${uploadId}.${extension}`;
  const method = input.size > TUS_BYTES ? "tus" : "standard";

  let endpoint: string | undefined;
  if (method === "tus") {
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      throw new AppError("系統異常，請通知IT", 500);
    }

    try {
      const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
      endpoint = `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;
    } catch {
      throw new AppError("Supabase URL 設定格式錯誤", 500);
    }
  }

  const { data, error } = await supabase.storage
    .from(VIDEO_BUCKET)
    .createSignedUploadUrl(path);

  if (error) {
    throw new AppError("建立影片上傳授權失敗", 500);
  }

  const expiresAt = new Date(
    Date.now() +
      (method === "tus" ? TUS_UPLOAD_TTL_MS : STANDARD_UPLOAD_TTL_MS),
  );

  await createMediaUploadDb({
    uploadId,
    bucket: VIDEO_BUCKET,
    path,
    expectedSize: BigInt(input.size),
    contentType: input.contentType,
    method,
    expiresAt,
  });

  if (method === "tus") {
    return {
      uploadId,
      method,
      endpoint,
      bucket: VIDEO_BUCKET,
      path,
      token: data.token,
      signatureHeader: "x-signature",
      chunkSize: CHUNK_SIZE,
    };
  }

  return {
    uploadId,
    method,
    bucket: VIDEO_BUCKET,
    path,
    token: data.token,
  };
};

export const checkCompleteLogic = async (uploadId: string) => {
  const data = await mediaUploadVideo(uploadId);
  if (!data) {
    throw new AppError("找不到這筆上傳紀錄", 404);
  }

  if (data.status === MediaUploadStatus.PENDING_VERIFICATION ||
      data.status === MediaUploadStatus.VERIFYING ||
      data.status === MediaUploadStatus.READY) {
    return { uploadId, status: data.status };
  }

  if (data.status !== MediaUploadStatus.PENDING_UPLOAD) {
    throw new AppError("這筆上傳目前無法確認完成", 409);
  }

  if (Date.now() > data.expiresAt.getTime()) {
    await updateMediaUploadState(uploadId, MediaUploadStatus.FAILED);
    throw new AppError("上傳授權已逾時，請重新上傳", 410);
  }

  const { data: fileInfo, error } = await supabase.storage
    .from(data.bucket)
    .info(data.path);

  if (error) {
    if (error.statusCode === "404") {
      throw new AppError("Storage 中尚未找到已上傳的檔案", 409);
    }
    throw new AppError("目前無法確認 Storage 檔案狀態", 502);
  }

  if (fileInfo.size === undefined || BigInt(fileInfo.size) !== data.expectedSize) {
    throw new AppError("Storage 檔案大小與申請時不符", 409);
  }

  if (fileInfo.contentType && fileInfo.contentType !== data.contentType) {
    throw new AppError("Storage 檔案格式與申請時不符", 409);
  }

  const updated = await updateMediaUploadState(
    uploadId,
    MediaUploadStatus.PENDING_VERIFICATION,
  );

  if (updated.count !== 1) {
    const latest = await mediaUploadVideo(uploadId);
    if (latest?.status === MediaUploadStatus.PENDING_VERIFICATION ||
        latest?.status === MediaUploadStatus.VERIFYING ||
        latest?.status === MediaUploadStatus.READY) {
      return { uploadId, status: latest.status };
    }
    throw new AppError("上傳狀態已變更，請重新查詢", 409);
  }

  return { uploadId, status: MediaUploadStatus.PENDING_VERIFICATION };
};
