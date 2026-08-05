import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { UserType } from "../types/authType";
import { AppError } from "../utils/errors";

export const registerUserDb = async ({
  password,
  userName,
  email,
}: UserType) => {
  try {
    return await prisma.user.create({
      data: {
        password,
        userName,
        email,
      },
      select: {
        id: true,
        email: true,
        userName: true,
      },
    });
  } catch (err: any) {
    // Prisma unique error
    if (err.code === "P2002") {
      throw new AppError("使用者已存在", 400, "email");
    }
    throw err;
  }
};

export const userDb = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

//紀錄refreshToken
export const refreshTokenDb = async (
  token: string,
  userId: string,
  userAgent: string,
  ip: string,
  expiresAt: Date,
  absoluteExpiresAt: Date,
) => {
  await prisma.refreshToken.create({
    data: {
      tokenHash: token,
      userId,
      userAgent,
      ip,
      expiresAt,
      absoluteExpiresAt,
    },
  });
};

//storedToken
export const storedTokenDb = async (tokenHash: string) => {
  return await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });
};

//登出
export const logoutDb = async (tokenHash: string) => {
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
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
      expiresAt: expiresAt,
    },
    update: {
      code,
      expiresAt: expiresAt,
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
  console.log("record", record);
  return record;
};

//更新密碼
export const newPasswordDb = async (email: string, newPassword: string) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const result = await tx.user.update({
      where: { email },
      data: { password: newPassword },
    });

    await tx.emailTable.delete({
      where: { email },
    });
    return result;
  });
};

//refresh token 替換
export const refreshTokenChange = async (
  tokenHash: string,
  newHashToken: string,
  userId: string,
  userAgent: string,
  ip: string,
  expiresAt: Date,
  absoluteExpiresAt: Date,
) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    await tx.refreshToken.create({
      data: {
        tokenHash: newHashToken,
        userId,
        userAgent,
        ip,
        expiresAt,
        absoluteExpiresAt,
      },
    });
  });
};
