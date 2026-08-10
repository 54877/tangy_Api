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
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const result = await prisma.svTable.upsert({
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

  console.log("SV RESULT =", result);
};
