import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  console.log(`Server running on port ${PORT}`);
});
