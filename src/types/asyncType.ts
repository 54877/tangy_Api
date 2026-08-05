import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";

export type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type JwtAsyncFunction = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => Promise<void>;
