import { z } from "../../config/zod";
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
