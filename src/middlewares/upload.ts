import multer from "multer";
import path from "node:path";
import fs from "node:fs";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_FILE_SIZE = 50 * 1024 * 1024; //50MB

const imageStorage = multer.memoryStorage();

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve("uploads");

    console.log("===== MULTER DESTINATION =====");
    console.log("cwd:", process.cwd());
    console.log("destination:", uploadPath);
    console.log("exists:", fs.existsSync(uploadPath));

    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;

    console.log("===== MULTER FILENAME =====");
    console.log("filename:", filename);

    cb(null, filename);
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
