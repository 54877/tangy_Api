import { requiredString } from "../primitives/string";
import { z } from "../../config/zod";
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export const fileNameSchema = requiredString.max(255, "最大不可超過255個字");
export const sizeSchema = z
  .number()
  .int()
  .positive()
  .max(MAX_VIDEO_SIZE, "最大不可超過50MB");
export const contentTypeSchema = z.enum(["video/mp4", "video/webm"], {
  errorMap: () => ({
    message: "檔案格式只允許 MP4 或 WebM",
  }),
});
