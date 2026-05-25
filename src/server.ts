import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { query } from "./db/db.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await query("SELECT 1");

    app.listen(PORT, () => {
      console.log("Server running on", PORT);
    });
  } catch (err) {
    console.error("DB not ready:", err);
    process.exit(1);
  }
}

start();
