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

export const updateUserImageById = async (imageUrl: string, id: string) => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      imageUrl,
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

// 建立課程頁面使用的標籤與分類選項，不回傳後台專用欄位。
export const getCourseFormOptionsDb = async () => {
  const [tags, categories] = await Promise.all([
    prisma.tagsTable.findMany({
      select: { key: true, label: true },
      orderBy: { key: "asc" },
    }),
    prisma.courseCategoryTable.findMany({
      select: { categoryKey: true, CategoryName: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return {
    tags: tags.map((tag) => ({ ...tag, key: String(tag.key) })),
    categories,
  };
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
