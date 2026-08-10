export interface UserType {
  password: string;
  userName: string;
  email: string;
}

export type UserRole = "user" | "admin";

export interface UserProps {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
}

export interface TokenType {
  user: UserProps;
  userAgent: string;
  ip: string;
}

export interface LoginToken {
  accessToken: string;
  refreshToken: string;
  userDate: UserProps;
}
