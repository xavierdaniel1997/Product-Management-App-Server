export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  isRegComplet?: boolean;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
