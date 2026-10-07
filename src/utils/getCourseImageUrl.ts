import { supabase } from "../config/supabase";

type WithImage = {
  imageUrl: string | null;
};

// 多筆
export const getCourseImageUrls = async <T extends WithImage>(
  dataList: T[],
  bucket: string,
) => {
  return Promise.all(
    dataList.map(async (item) => {
      const imageFileName = item.imageUrl;

      if (!imageFileName) {
        return {
          ...item,
          imageUrl: null,
          imageFileName: null,
        };
      }
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(imageFileName, 60 * 10);

      if (error) {
        console.error("圖片下載失敗", {
          error,
        });

        return {
          ...item,
          imageUrl: null,
          imageFileName: null,
        };
      }

      return {
        ...item,
        imageUrl: data.signedUrl,
        imageFileName: imageFileName,
      };
    }),
  );
};

// 單筆
export const getCourseImageUrl = async <T extends WithImage>(
  data: T,
  bucket: string,
) => {
  const result = await getCourseImageUrls([data], bucket);

  return result[0];
};
