import { randomUUID } from "node:crypto";
import { MediaUploadStatus } from "@prisma/client";
import { supabase } from "../config/supabase";
import { mediaUploadQueue } from "../queues/mediaUpload.queue.js";
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
    //---------------------------------------
    if (method === "tus") {
      console.error("[tus-upload:sign-failed]", {
        uploadId,
        errorName: error.name,
        errorMessage: error.message,
        status: error.status,
      });
    }
    //---------------------------------------
    throw new AppError("建立影片上傳授權失敗", 500);
  }

  //---------------------------------------
  if (method === "tus") {
    const tokenParts = data.token.split(".");
    let tokenHeader: Record<string, unknown> | null = null;
    let tokenPayload: Record<string, unknown> | null = null;
    try {
      tokenHeader = JSON.parse(
        Buffer.from(tokenParts[0] ?? "", "base64url").toString("utf8"),
      );
      tokenPayload = JSON.parse(
        Buffer.from(tokenParts[1] ?? "", "base64url").toString("utf8"),
      );
    } catch {
      // Log only token structure below; never print the token itself.
    }
    const configuredProjectRef = new URL(
      process.env.SUPABASE_URL!,
    ).hostname.split(".")[0];
    const tokenObjectPath =
      typeof tokenPayload?.url === "string"
        ? tokenPayload.url.replace(`${VIDEO_BUCKET}/`, "")
        : null;
    console.info("[tus-upload:token-issued]", {
      uploadId,
      endpointProjectRef: endpoint?.split("https://")[1]?.split(".")[0],
      configuredProjectRef,
      tokenPartCount: tokenParts.length,
      tokenPartsNonEmpty: tokenParts.map((part) => part.length > 0),
      tokenAlgorithm: tokenHeader?.alg ?? null,
      tokenKeyIdPresent: typeof tokenHeader?.kid === "string",
      tokenScope: tokenPayload?.scope ?? null,
      tokenBucketMatches:
        typeof tokenPayload?.url === "string" &&
        tokenPayload.url.startsWith(`${VIDEO_BUCKET}/`),
      tokenPathMatches: tokenObjectPath === path,
      tokenIssuedAt: tokenPayload?.iat ?? null,
      tokenExpiresAt: tokenPayload?.exp ?? null,
    });
  }
  //---------------------------------------

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

//將API加入序列
const addQueue = async (uploadId: string) => {
  await mediaUploadQueue.add(
    "verify-upload",
    { uploadId },
    { jobId: uploadId },
  );
};

//驗證db檔案
const mediaValidation = async (uploadId: string) => {
  const data = await mediaUploadVideo(uploadId);
  if (!data) {
    throw new AppError("找不到這筆上傳紀錄", 404);
  }

  if (
    data.status === MediaUploadStatus.PENDING_VERIFICATION ||
    data.status === MediaUploadStatus.VERIFYING
  ) {
    await addQueue(uploadId);
    return { uploadId, status: data.status };
  }

  if (data.status === MediaUploadStatus.READY) {
    return { uploadId, status: data.status };
  }

  if (Date.now() > data.expiresAt.getTime()) {
    await updateMediaUploadState(uploadId, MediaUploadStatus.FAILED);
    throw new AppError("上傳授權已逾時，請重新上傳", 410);
  }

  if (data.status !== MediaUploadStatus.PENDING_UPLOAD) {
    throw new AppError("這筆上傳目前無法確認完成", 409);
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

  if (
    fileInfo.size === undefined ||
    BigInt(fileInfo.size) !== data.expectedSize
  ) {
    throw new AppError("Storage 檔案大小與申請時不符", 409);
  }

  if (fileInfo.contentType && fileInfo.contentType !== data.contentType) {
    throw new AppError("Storage 檔案格式與申請時不符", 409);
  }
};

export const checkCompleteLogic = async (uploadId: string) => {
  //驗證db檔案
  const state = await mediaValidation(uploadId);

  if (state) {
    return state;
  }
  //更新狀態
  const updated = await updateMediaUploadState(
    uploadId,
    MediaUploadStatus.PENDING_VERIFICATION,
  );

  // 處理併發確認完成的情況
  if (updated.count !== 1) {
    const latest = await mediaUploadVideo(uploadId);
    if (
      latest?.status === MediaUploadStatus.PENDING_VERIFICATION ||
      latest?.status === MediaUploadStatus.VERIFYING ||
      latest?.status === MediaUploadStatus.READY
    ) {
      if (latest.status !== MediaUploadStatus.READY) {
        await addQueue(uploadId);
      }
      return { uploadId, status: latest.status };
    }
    throw new AppError("上傳狀態已變更，請重新查詢", 409);
  }

  await addQueue(uploadId);

  return { uploadId, status: MediaUploadStatus.PENDING_VERIFICATION };
};
