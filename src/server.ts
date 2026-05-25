import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { query } from "./db/db.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log("server started on", PORT);

  const result = await query("SELECT NOW()");
  console.log("DB connected:", result.rows);
});
