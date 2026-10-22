import { RequestHandler } from "express";
import { isAdmin } from "../utils/role";

export const adminMiddleware: RequestHandler = (req, _res, next): void => {
  try {
    isAdmin(req);
    next();
  } catch (error) {
    next(error);
  }
};
