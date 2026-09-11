import multer from "multer";
import path from "node:path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_FILE_SIZE = 50 * 1024 * 1024; //50MB

const imageStorage = multer.memoryStorage();

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const upload = multer({
  storage: imageStorage,

  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: MAX_VIDEO_FILE_SIZE,
  },
});
