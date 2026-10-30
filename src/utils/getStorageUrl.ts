import { supabase } from "../config/supabase";

type WithStoragePath = {
  imageUrl?: string | null;
  video?: string | null;
};

// 多筆
export const getStorageUrls = async <T extends WithStoragePath>(
  dataList: T[],
  bucket: string,
  type: "video" | "image",
) => {
  const results = await Promise.all(
    dataList.map(async (item) => {
      const objectPath = type === "image" ? item.imageUrl : item.video;
      const resultName = type === "image" ? "imageUrl" : "videoUrl";

      if (!objectPath) {
        return {
          ...item,
          [resultName]: null,
        };
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(objectPath, 60 * 30);

      if (error) {
        console.error("連結產生失敗", {
          bucket,
          objectPath,
          error,
        });

        return {
          ...item,
          [resultName]: null,
        };
      }

      return {
        ...item,
        [resultName]: data.signedUrl,
      };
    }),
  );

  return results;
};

// 單筆
export const getStorageUrl = async <T extends WithStoragePath>(
  data: T,
  bucket: string,
  type: "video" | "image",
) => {
  const [result] = await getStorageUrls([data], bucket, type);
  return result;
};
