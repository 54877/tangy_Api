import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../utils/errors";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitEntries = new Map<string, RateLimitEntry>();
let nextLimiterId = 0;

// 定期移除已過期的計數。
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitEntries) {
    if (entry.resetAt <= now) rateLimitEntries.delete(key);
  }
}, 60_000);

cleanupTimer.unref();

// 限制目前套用此 middleware 的路由中，每位已登入使用者可發送的請求次數。
// time 的單位是毫秒。

export const userRateLimit = (
  time: number,
  maxRequests: number,
): RequestHandler => {
  if (!Number.isSafeInteger(time) || time <= 0) {
    throw new Error("userRateLimit 的時間必須是正整數毫秒");
  }
  if (!Number.isSafeInteger(maxRequests) || maxRequests <= 0) {
    throw new Error("userRateLimit 的次數必須是正整數");
  }

  // 每次呼叫都會建立獨立的限制器。
  const limiterId = nextLimiterId++;

  return (req: Request, _res: Response, next: NextFunction): void => {
    const userId = req.user?.id;
    if (!userId) {
      next(new AppError("未登入", 401));
      return;
    }

    const key = `${limiterId}:${userId}`;
    const now = Date.now();
    let entry = rateLimitEntries.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + time };
      rateLimitEntries.set(key, entry);
    }

    if (entry.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((entry.resetAt - now) / 1000),
      );
      _res.setHeader("Retry-After", String(retryAfterSeconds));
      const waitTime =
        retryAfterSeconds > 60
          ? `${Math.round(retryAfterSeconds / 60)} 分鐘`
          : `${retryAfterSeconds} 秒`;

      next(new AppError(`請求過於頻繁，請於 ${waitTime} 後再試`, 429));
      return;
    }

    entry.count += 1;
    next();
  };
};
