import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
};
