export interface UserType {
  password: string;
  userName: string;
  email: string;
}

export interface TokenType {
  email: string;
  password: string;
  userAgent: string;
  ip: string;
}
