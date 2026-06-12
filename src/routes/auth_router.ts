import express from "express";
import { loginUser, registerUser } from "../controllers/auth_controllers";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../validation/schemas/auth.schema";
import { openapiRoute } from "../utils/openapiRoute";
import { asyncHandler } from "../utils/asyncHandler";

export const auth_router = express.Router();

// auth_router.post(
//   "/register",
//   validateRequest(registerSchema),
//   asyncHandler(registerUser),
// );

openapiRoute({
  method: "post",
  path: "/register",
  tags: ["Auth"],
  summary: "註冊帳號",
  schema: registerSchema,
  handler: [validateRequest(registerSchema), asyncHandler(registerUser)],
  router: auth_router,
});

openapiRoute({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  summary: "登入帳號",
  schema: loginSchema,
  handler: [validateRequest(loginSchema), asyncHandler(loginUser)],
  router: auth_router,
});
