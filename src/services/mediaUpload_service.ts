import { randomUUID } from "node:crypto";
import { supabase } from "../config/supabase";
import { createMediaUploadDb } from "../repository/mediaUpload_Repository";
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
