import { fileTypeFromBuffer } from "file-type";
import { AppError } from "./errors";
import sharp from "sharp";

export const useImageRuler = async (image: Express.Multer.File | undefined) => {
  const AllowType = new Set(["image/jpeg", "image/png"]);

  //驗證圖片
  if (!image) {
    throw new AppError("請上傳圖片", 400, "image");
  }

  //驗證圖片格式
  if (!AllowType.has(image.mimetype)) {
    throw new AppError("只允許 JPG、 JPEG、PNG圖片", 400, "image");
  }

  //驗證圖片magic Bytes
  const fileType = await fileTypeFromBuffer(image.buffer);

  if (
    !fileType ||
    !AllowType.has(fileType.mime) ||
    fileType.mime !== image.mimetype
  ) {
    throw new AppError("圖片格式驗證失敗", 400, "image");
  }

  //驗證sharp實際解析(高度、寬度、像素)
  const metadata = await sharp(image.buffer).metadata();

  if (!metadata) {
    throw new AppError("圖片檔無法解析", 400, "image");
  }

  const MAX_WIDTH = 4096;
  const MAX_HEIGHT = 4096;
  const MAX_PIXELS = 16_000_000;
  const pixels = metadata.width * metadata.height;
  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width > MAX_WIDTH ||
    metadata.height > MAX_HEIGHT
  ) {
    throw new AppError("圖片尺寸不可超過 4096 × 4096", 400, "image");
  }

  if (pixels > MAX_PIXELS) {
    throw new AppError("圖片像素數過大", 400, "image");
  }

  //透過sharp重新建立圖片
  const processedImage = await sharp(image.buffer)
    .webp({
      quality: 80,
    })
    .toBuffer();

  //Server 產生新的檔案名稱
  const fileName = `course/${crypto.randomUUID()}.webp`;

  return {
    processedImage,
    fileName,
  };
};
