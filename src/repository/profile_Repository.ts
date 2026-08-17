import prisma from "../db/prisma";

export const updateUserById = async (
  id: string,
  userName: string,
  gender: string,
  introduction: string,
  birthday: Date,
) => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      userName,
      gender,
      introduction,
      birthday,
    },
  });
};

export const updatePasswordDb = async (newPassword: string, id: string) => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: newPassword,
    },
  });
};

// 建立驗證碼
export const createSVEmailVerification = async (
  codeHash: string,
  email: string,
) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.svTable.upsert({
    where: {
      email,
    },
    create: {
      email,
      codeHash,
      expiresAt,
    },
    update: {
      codeHash,
      expiresAt,
      count: 0,
    },
  });
};

//開啟2FA
export const SVDb = async (email: string) => {
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      svType: true,
    },
  });
};

//關閉
export const svCloseDb = async (id: string) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      svType: false,
    },
  });
};

//裝置Data
export const getUserDeviceByUserId = async (userId: string) => {
  return await prisma.deviceTable.findMany({
    where: {
      userId,
    },
  });
};

//刪除裝置 by id
export const deviceCloseById = async (id: string) => {
  return await prisma.deviceTable.delete({
    where: {
      id,
    },
  });
};

//刪除裝置 by userId
export const deviceCloseByUserId = async (userId: string) => {
  return await prisma.deviceTable.deleteMany({
    where: {
      userId,
    },
  });
};
