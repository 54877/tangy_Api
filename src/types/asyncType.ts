import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";

export type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type JwtAsyncFunction = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => Promise<void>;
