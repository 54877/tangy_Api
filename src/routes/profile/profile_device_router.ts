import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import {
  deviceCloseByIdControllers,
  deviceCloseByUserIdControllers,
} from "../../controllers/profile/profile_device_controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { openapiRoute } from "../../utils/openapiRoute";
import {
  UuidIdSchema,
  UuidUserIdSchema,
} from "../../validation/schemas/common.schema";

export const profileDeviceRouter = express.Router();

profileDeviceRouter.use(authMiddleware);

openapiRoute({
  method: "post",
  path: "/DeviceCloseById",
  tags: ["Profile / Devices"],
  needAuth: true,
  schema: UuidIdSchema,
  summary: "登出裝置",
  handler: [asyncHandler(deviceCloseByIdControllers)],
  router: profileDeviceRouter,
});

openapiRoute({
  method: "post",
  path: "/DeviceCloseByUserId",
  tags: ["Profile / Devices"],
  needAuth: true,
  schema: UuidUserIdSchema,
  summary: "登出所有裝置",
  handler: [asyncHandler(deviceCloseByUserIdControllers)],
  router: profileDeviceRouter,
});
