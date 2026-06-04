import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { query } from "./db/db.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await query("SELECT 1");
    console.log("DB connected");
  } catch (err) {
    console.error("DB failed:", err);
  }

  app.listen(PORT, () => {
    console.log("Server running");
  });
}

start();
