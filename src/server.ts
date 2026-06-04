import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { query } from "./db/db.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await query("SELECT 1");
    console.log("DB connected");
    console.log("RAW DATABASE_URL:");
    console.log(process.env.DATABASE_URL);
    console.log("TYPE:", typeof process.env.DATABASE_URL);
  } catch (err) {
    console.error("DB failed:", err);
  }

  app.listen(PORT, () => {
    console.log("Server running");
  });
}

start();
