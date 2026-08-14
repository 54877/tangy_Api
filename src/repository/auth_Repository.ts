import { prisma } from "../db/prisma";
import { DeviceProps, RefreshTokenProps, UserType } from "../types/authType";
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
export const refreshTokenDb = async ({
  tokenHash,
  deviceId,
  ip,
  expiresAt,
  absoluteExpiresAt,
}: RefreshTokenProps) => {
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      deviceId,
      ip,
      expiresAt,
      absoluteExpiresAt,
    },
  });
};

//紀錄device
export const deviceDb = async (device: DeviceProps) => {
  const { deviceId, ...deviceData } = device;
  if (deviceId) {
    const existingDevice = await prisma.deviceTable.findUnique({
      where: {
        id: deviceId,
      },
    });

    if (existingDevice) {
      return await prisma.deviceTable.update({
        where: {
          id: existingDevice.id,
        },
        data: {
          lastUseAt: new Date(),
        },
      });
    }
  }

  return await prisma.deviceTable.create({
    data: deviceData,
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
export const logoutDb = async (tokenHash: string, deviceId: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    await tx.deviceTable.update({
      where: {
        id: deviceId,
      },
      data: {
        lastUseAt: new Date(),
      },
    });
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

//刪除驗證
export const expiredCodeDb = async (email: string) => {
  await prisma.emailTable.delete({
    where: {
      email,
    },
  });
};

//刪除sv驗證
export const expiredSVCodeDb = async (email: string) => {
  await prisma.svTable.delete({
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

//sv驗證計數器
export const codeSVCountDb = async (email: string) => {
  await prisma.svTable.update({
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

//驗證 SV驗證碼
export const verifySVDb = async (email: string) => {
  const record = await prisma.svTable.findUnique({
    where: {
      email,
    },
  });
  return record;
};

//更新密碼
export const newPasswordDb = async (email: string, newPassword: string) => {
  return await prisma.$transaction(async (tx) => {
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
  oldToken: string,
  deviceId: string,
  newHashToken: string,
  ip: string,
  expiresAt: Date,
  absoluteExpiresAt: Date,
) => {
  return await prisma.$transaction(async (tx) => {
    await tx.refreshToken.update({
      where: {
        tokenHash: oldToken,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    await tx.refreshToken.create({
      data: {
        tokenHash: newHashToken,
        deviceId: deviceId,
        ip,
        expiresAt,
        absoluteExpiresAt,
      },
    });

    await tx.deviceTable.update({
      where: {
        id: deviceId,
      },
      data: {
        lastUseAt: new Date(),
      },
    });
  });
};
