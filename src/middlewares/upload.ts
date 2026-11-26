import multer from "multer";
import { MAX_MULTIPART_FIELD_SIZE } from "../constants/upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const imageStorage = multer.memoryStorage();

export const upload = multer({
  storage: imageStorage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    fieldSize: MAX_MULTIPART_FIELD_SIZE,
    fields: 12,
    parts: 13,
  },
});

