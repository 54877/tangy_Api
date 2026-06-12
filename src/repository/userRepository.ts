import { DatabaseError } from "pg";
import { query } from "../db/db";
import { user } from "../types/authType";
import { AppError } from "../utils/errors";
import { prisma } from "../db/prisma";

export const registerUserDb = async ({ password, user_name, email }: user) => {
  try {
    const result = await query(
      `INSERT INTO user_table ( password , user_name , email) VALUES ($1, $2 , $3 ) RETURNING id , email , user_name`,
      [password, user_name, email],
    );

    return result.rows[0];
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new AppError("使用者已存在", 400);
    }
    throw err;
  }
};

export const userDb = async (email: string) => {
  return await prisma.userTable.findUnique({
    where: {
      email,
    },
  });
};
