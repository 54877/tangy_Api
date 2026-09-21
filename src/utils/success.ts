import { Response } from "express";

export const success = (res: Response, state: number, dataSet?: unknown) => {
  res.status(state).json({
    dataSet,
    message: "成功",
    state: true,
  });
};
