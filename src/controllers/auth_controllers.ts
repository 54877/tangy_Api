import { Request, Response } from "express";
import { loginUserLogic, registerUserLogic } from "../services/auth_services";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { password, user_name, email } = req.body || {};
  await registerUserLogic({ password, user_name, email });

  res.status(201).json({
    message: "註冊成功",
    state: true,
  });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body || {};
  const accessToken = await loginUserLogic({ email, password });

  res.status(201).json({
    accessToken,
    message: "登入成功",
    state: true,
  });
};
