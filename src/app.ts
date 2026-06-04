import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errors.js";
import { query } from "./db/db.js";

const app = express();

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

// 解析 JSON 格式的請求體
app.use(express.json());

//api
app.get("/health", async (req, res) => {
  try {
    const result = await query("SELECT NOW()");
    res.json({
      ok: true,
      time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err,
    });
  }
});

app.use(errorHandler);
export default app;
