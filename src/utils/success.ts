import { Response } from "express";

export const success = (res: Response, state: number, data?: unknown) => {
  res.status(state).json({
    data,
    message: "成功",
    state: true,
  });
};
