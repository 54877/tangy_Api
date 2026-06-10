import express from "express";
import { registerUser } from "../controllers/login_controllers";
import { validateRequest } from "../middlewares/validateRequest";
import { registerSchema } from "../validation/register.schema";
import { openapiRoute } from "../utils/openapiRoute";

export const auth_router = express.Router();

openapiRoute({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  summary: "註冊帳號",
  schema: registerSchema,
  handler: [validateRequest(registerSchema), registerUser],
  router: auth_router,
});
