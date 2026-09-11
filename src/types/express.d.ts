import "express";

declare global {
  namespace Express {
    interface Request {
      uploadType?: "image" | "video";
    }
  }
}
