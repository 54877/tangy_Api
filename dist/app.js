"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
import { errorHandler } from "./utils/errors";
const app = (0, express_1.default)();
//跨網域設定
app.use(
  (0, cors_1.default)({
    origin: [
      "http://localhost:5173",
      "https://54877.github.io",
      "http://localhost:5174",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
// 解析 JSON 格式的請求體
app.use(express_1.default.json());
//api
app.use(errorHandler);
const _default = app;
export { _default as default };
//# sourceMappingURL=app.js.map
