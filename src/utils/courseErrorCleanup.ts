import { deleteVideoUploadTicket } from "../repository/common/video_upload_ticket_repository";
import { deleteCourseFile } from "./supabase/removeSupabaseStorage";

type VideoTicket = {
  jti: string;
  videoKey: string;
};

type CourseErrorCleanupValues = {
  verifiedVideoTicket?: VideoTicket;
  userId: string;
  imageUploadAttempted: boolean;
  imagePath?: string;
  videoKey?: string;
};

export const cleanupCourseAfterApiError = async ({
  verifiedVideoTicket,
  userId,
  imageUploadAttempted,
  imagePath,
  videoKey,
}: CourseErrorCleanupValues): Promise<void> => {
  if (verifiedVideoTicket) {
    const ticketRemoved = await deleteVideoUploadTicket({
      jti: verifiedVideoTicket.jti,
      userId,
      videoKey: verifiedVideoTicket.videoKey,
    }).catch(() => false);

    // 只有確實刪除憑證的請求才清理檔案，避免刪到另一個成功請求正在使用的影片。
    if (!ticketRemoved) return;

    if (imageUploadAttempted && imagePath) {
      await deleteCourseFile("course", imagePath).catch(() => {});
    }
    if (videoKey) {
      await deleteCourseFile("videos", videoKey).catch(() => {});
    }
    return;
  }

  if (imageUploadAttempted && imagePath) {
    await deleteCourseFile("course", imagePath).catch(() => {});
  }
};
