import { Request, Response, NextFunction } from "express";
import { z } from "../config/zod";

export const validateRequest =
  <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request<{}, {}, z.infer<T>>, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formatted = result.error.issues.reduce(
        (acc, cur) => {
          const key = cur.path.join(".");
          acc[key] ||= [];
          acc[key].push(cur.message);
          return acc;
        },
        {} as Record<string, string[]>,
      );

      return res.status(400).json({
        message: "Validation error",
        errors: formatted,
      });
    }

    req.body = result.data;
    next();
  };
