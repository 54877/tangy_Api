import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../utils/jwt";
import { AppError } from "../utils/errors";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("未登入", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
