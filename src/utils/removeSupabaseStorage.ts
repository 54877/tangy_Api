import { supabase } from "../config/supabase";

export const deleteCourseFile = async (
  bucketName: string,
  fileName: string,
) => {
  const { error } = await supabase.storage.from(bucketName).remove([fileName]);

  if (error) {
    throw error;
  }
};
