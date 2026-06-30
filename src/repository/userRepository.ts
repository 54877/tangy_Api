import { DatabaseError } from "pg";
import { query } from "../db/db";
import { UserType } from "../types/authType";
import { AppError } from "../utils/errors";
import { prisma } from "../db/prisma";

export const registerUserDb = async ({
  password,
  user_name,
  email,
}: UserType) => {
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

// 建立驗證碼
export const createEmailVerification = async (code: string, email: string) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await prisma.emailTable.upsert({
    where: {
      email: email,
    },
    create: {
      email,
      code,
      expires_at: expiresAt,
    },
    update: {
      code,
      expires_at: expiresAt,
      count: 0,
    },
  });
};

//過期刪除驗證
export const expiredCodeDb = async (email: string) => {
  await prisma.emailTable.delete({
    where: {
      email,
    },
  });
};

//驗證計數器
export const codeCountDb = async (email: string) => {
  await prisma.emailTable.update({
    where: {
      email,
    },
    data: {
      count: {
        increment: 1,
      },
    },
  });
};

//驗證 驗證碼
export const verifyDb = async (email: string) => {
  const record = await prisma.emailTable.findUnique({
    where: {
      email,
    },
  });

  return record;
};

//更新密碼
export const newPasswordDb = async (email: string, newPassword: string) => {
  return await prisma.$transaction(async (tx) => {
    const result = await tx.userTable.update({
      where: { email },
      data: { password: newPassword },
    });

    await tx.emailTable.deleteMany({
      where: { email },
    });
    return result;
  });
};
