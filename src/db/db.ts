import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: String(process.env.DATABASE_URL).trim(),
  ssl: {
    rejectUnauthorized: false,
  },
});
console.log(`123123132132`, process.env.DATABASE_URL);
export const query = (text: string, params?: any[]) => pool.query(text, params);
