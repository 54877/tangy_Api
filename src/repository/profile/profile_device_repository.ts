import prisma from "../../db/prisma";

export const getUserDeviceByUserId = async (userId: string) => {
  return await prisma.deviceTable.findMany({
    where: { userId },
  });
};

export const deviceCloseById = async (id: string) => {
  return await prisma.deviceTable.delete({
    where: { id },
  });
};

export const deviceCloseByUserId = async (userId: string) => {
  return await prisma.deviceTable.deleteMany({
    where: { userId },
  });
};
