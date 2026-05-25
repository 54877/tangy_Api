import dotenv from "dotenv";
dotenv.config(); // 有jwt驗證就需要這段

import app from "./app.js";
import { query } from "./db/db.js";
// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(3000, async () => {
  console.log("server started");

  const result = await query("SELECT NOW()");
  console.log("DB connected:", result.rows);
});
