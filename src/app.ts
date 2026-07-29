import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errors.js";
import { auth_router } from "./routes/auth_router.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.disable("x-powered-by");
//跨網域設定
app.use(
  cors({
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

app.use(cookieParser());
// 解析 JSON 格式的請求體
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//api
app.use("/tangy", auth_router);
app.use(errorHandler);
export default app;
