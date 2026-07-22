import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

if (!REFRESH_SECRET) {
  throw new Error("REFRESH_SECRET is not defined");
}

export const createAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
