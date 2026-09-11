import { fileTypeFromFile } from "file-type";
import { AppError } from "./errors";
import ffprobe from "ffprobe-static";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
interface VideoMetadata {
  format?: {
    duration?: string | number;
    format_name?: string;
  };
  streams?: {
    codec_type?: string;
    codec_name?: string;
    width?: number;
    height?: number;
    r_frame_rate?: string;
  }[];
}

const execFileAsync = promisify(execFile);

//影片規格驗證
export const useVideoRuler = async (video: Express.Multer.File) => {
  const allowedMimeTypes = new Set(["video/mp4", "video/webm"]);

  //MIME Type
  if (!allowedMimeTypes.has(video.mimetype)) {
    throw new AppError("只允許 MP4、webm影片", 400, "video");
  }

  //Magic bytes
  const fileType = await fileTypeFromFile(video.path);

  if (!fileType) {
    throw new AppError("無法辨識影片格式", 400, "video");
  }

  if (!["mp4", "webm"].includes(fileType.ext)) {
    throw new AppError("影片格式錯誤", 400, "video");
  }

  //ffprobe
  const duration = await ffprobeValidation(video);

  return duration;
};

//解析度與FPS驗證
const validateVideoResolution = (videoStream: {
  width?: number;
  height?: number;
  r_frame_rate?: string;
}) => {
  const width = Number(videoStream?.width);
  const height = Number(videoStream?.height);
  const fps =
    Number(videoStream?.r_frame_rate?.split("/")[0]) /
    Number(videoStream?.r_frame_rate?.split("/")[1]);

  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    throw new AppError("無法取得影片解析度", 400, "video");
  }

  if (width <= 0 || height <= 0) {
    throw new AppError("影片解析度無效", 400, "video");
  }

  const MAX_WIDTH = 1920;
  const MAX_HEIGHT = 1080;

  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    throw new AppError("影片解析度不可超過 1920x1080", 400, "video");
  }

  if (!Number.isFinite(fps) || fps <= 0) {
    throw new AppError("無法取得影片 FPS", 400, "video");
  }

  const MAX_FPS = 60;

  if (fps > MAX_FPS) {
    throw new AppError("影片 FPS 不可超過 60", 400, "video");
  }
};

//影片時間驗證
const durationValidate = (metadata: VideoMetadata) => {
  const duration = Number(metadata.format?.duration);

  if (!Number.isFinite(duration) || duration <= 0) {
    throw new AppError("無法取得影片長度", 400, "video");
  }

  const MAX_VIDEO_DURATION_SECONDS = 2 * 60 * 60;

  if (duration > MAX_VIDEO_DURATION_SECONDS) {
    throw new AppError("影片長度不可超過 2 小時", 400, "video");
  }

  return duration;
};

//container 與 codec(編碼方式)
const validateVideoFormat = (metadata: VideoMetadata) => {
  const format = metadata.format?.format_name;
  const streams = metadata.streams ?? [];

  const videoStream = streams.find(
    (stream: { codec_type?: string }) => stream.codec_type === "video",
  );

  const audioStream = streams.find(
    (stream: { codec_type?: string }) => stream.codec_type === "audio",
  );

  const videoCodec = videoStream?.codec_name;
  const audioCodec = audioStream?.codec_name;

  if (format?.includes("mp4")) {
    if (videoCodec !== "h264" || audioCodec !== "aac") {
      throw new AppError("MP4 僅允許 H.264 影片與 AAC 音訊", 400, "video");
    }
  } else if (format?.includes("webm")) {
    const validAudioCodec = audioCodec === "opus" || audioCodec === "vorbis";
    if (videoCodec !== "vp9" || !validAudioCodec) {
      throw new AppError(
        "WebM 僅允許 VP9 影片，以及 Opus 或 Vorbis 音訊",
        400,
        "video",
      );
    }
  } else {
    throw new AppError("不支援的影片格式", 400, "video");
  }

  return videoStream;
};

//ffprobe
const ffprobeValidation = async (video: Express.Multer.File) => {
  try {
    const { stdout } = await execFileAsync(ffprobe.path, [
      "-v",
      "error",
      "-show_streams",
      "-show_format",
      "-of",
      "json",
      video.path,
    ]);

    const metadata = JSON.parse(stdout);

    // Container / Codec
    const videoStream = validateVideoFormat(metadata);

    if (!videoStream) {
      throw new AppError("無法取得影片串流", 400, "video");
    }

    // Duration 影片時間
    const duration = durationValidate(metadata);

    //影片解析度
    validateVideoResolution(videoStream);

    return duration;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("影片無法解析", 400, "video");
  }
};
