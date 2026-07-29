import prisma from "../db/prisma";
import { getUserByIdLogic } from "../services/profile_services";
import { JwtAsyncFunction } from "../types/asyncType";

// export const getUser: JwtAsyncFunction = async (req, res) => {
//   const id = req.user?.id;

//   const userDate = await getUserByIdLogic(id);

//   res.status(200).json({
//     userDate,
//     message: "登入成功",
//     state: true,
//   });
// };

export const getUser: JwtAsyncFunction = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;

    res.status(200).json({
      state: true,
      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      state: false,
      error,
    });
  }
};
