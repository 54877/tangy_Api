import bcrypt from "bcrypt";
import { genderSelect } from "../constants/gender";
import { getUserById } from "../repository/nav_Repository";
import {
  createSVEmailVerification,
  updatePasswordDb,
  updateUserById,
} from "../repository/profile_Repository";
import { AppError } from "../utils/errors";
import { randomInt } from "node:crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const getPersonalByIdLogic = async (id: string | undefined) => {
  if (!id) {
    throw new AppError("未登入", 401);
  }

  const userDate = await getUserById(id);

  if (!userDate) {
    throw new AppError("使用者不存在", 404);
  }

  return {
    userDate: {
      ...userDate,
      birthday: userDate?.birthday
        ? userDate.birthday.toISOString().split("T")[0]
        : null,
    },
    genderSelect,
  };
};

export const updatePersonalByIdLogic = async (
  id: string,
  userName: string,
  gender: string,
  introduction: string,
  birthday: string,
) => {
  const birthdayDate = new Date(birthday);
  await updateUserById(id, userName, gender, introduction, birthdayDate);
};

export const updatePasswordLogic = async (
  newPassword: string,
  oldPassword: string,
  id: string,
) => {
  const userDate = await getUserById(id);
  if (!userDate) {
    throw new AppError("使用者不存在", 404);
  }

  const psd = await bcrypt.compare(oldPassword, userDate.password);
  if (!psd) {
    throw new AppError("請輸入正確的舊密碼", 400, "oldPassword");
  }

  if (newPassword == oldPassword) {
    throw new AppError("新密碼不可與舊密碼相同", 400, "newPassword");
  }
  const hashPassword = await bcrypt.hash(newPassword, 10);

  await updatePasswordDb(hashPassword, id);
};

//驗證碼寄信
export const sendSVEmail = async (id: string, email: string) => {
  const userDate = await getUserById(id);
  if (userDate?.email !== email) {
    throw new AppError("請輸入正確email", 400, "email");
  }

  const code = randomInt(100000, 1000000).toString();
  const codeHash = await bcrypt.hash(code, 10);
  console.log("🔥 sendSVEmail HIT");
  await createSVEmailVerification(codeHash, email);
  console.log("🔥 createSVEmailVerification FINISHED");
  return await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "驗證碼",
    html: `<p>你的驗證碼是：<b>${code}</b></p>`,
  });
};
