import { ZodObject, ZodRawShape } from "zod";
import { z } from "../../config/zod";

// 上傳檔案由 Multer 處理，此 schema 僅供 OpenAPI 文件使用。
export const createImageSchema = <T extends ZodRawShape>(
  schema: ZodObject<T>,
) => {
  const imageSchema = {
    image: z.string().openapi({
      format: "binary",
      description: "課程封面圖片（JPG、JPEG 或 PNG）",
    }),
  };

  return schema.extend(imageSchema);
};
