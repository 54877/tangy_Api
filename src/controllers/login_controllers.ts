import { Request, Response } from "express";
import { registerUserLogic } from "../services/login_services";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { account, password, user_name } = req.body || {};
  console.log("API HIT");
  await registerUserLogic({ account, password, user_name });

  res.status(201).json({
    message: "註冊成功",
    state: true,
  });
};
