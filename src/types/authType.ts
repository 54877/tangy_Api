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
  svType: boolean;
  role: UserRole;
}

export interface TokenType {
  user: UserProps;
  userAgent: string;
  ip: string;
  deviceId: string;
}

export interface LoginToken {
  accessToken: string;
  refreshToken: string;
  userDate: UserProps;
}

export interface RefreshTokenProps {
  tokenHash: string;
  deviceId: string;
  ip: string;
  expiresAt: Date;
  absoluteExpiresAt: Date;
}

export interface DeviceProps {
  deviceId: string | undefined;
  userId: string;
  ip: string;
  userAgent: string;
  deviceType?: string | null;
  deviceVendor?: string | null;
  deviceModel?: string | null;
  os?: string | null;
  osVersion?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
}
