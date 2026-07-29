import prisma from "../db/prisma";

//id查詢使用者資料
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};
