import "dotenv/config";

import app from "./app.js";
import "./workers/mediaUpload.worker.js";

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
