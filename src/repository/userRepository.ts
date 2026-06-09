import { DatabaseError } from "pg";
import { query } from "../db/db";
import { user } from "../types/authType";
import { AppError } from "../utils/errors";

export const registerUserDb = async ({
  account,
  password,
  user_name,
}: user) => {
  try {
    const result = await query(
      `INSERT INTO user_table (account, password , user_name) VALUES ($1, $2 , $3) RETURNING id , account`,
      [account, password, user_name],
    );

    return result.rows[0];
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new AppError("使用者已存在", 400);
    }
    throw err;
  }
};
