import { z } from "../../config/zod";
import { UuidIdScheme } from "../rules/common.rule";
import {
  contentTypeSchema,
  fileNameSchema,
  sizeSchema,
} from "../rules/mediaUpload.ruler";

export const getUploadTokenSchema = z.object({
  fileName: fileNameSchema,
  size: sizeSchema,
  contentType: contentTypeSchema,
});

export const completeMediaUploadSchema = z.object({
  uploadId: UuidIdScheme,
});
