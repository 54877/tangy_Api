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
