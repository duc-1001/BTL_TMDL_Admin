// types/user.ts
export interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: "user" | "admin";
  isEmailVerified?: boolean;
  avatar?: string;
}
