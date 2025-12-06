export type UserRole = "user" | "admin";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
