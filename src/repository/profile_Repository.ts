import prisma from "../db/prisma";
import { UserProfileType } from "../types/profileType";

export const updateUserById = async (data: UserProfileType) => {
  const { id, password, createdAt, email, ...userDate } = data;
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      ...userDate,
    },
  });
};
