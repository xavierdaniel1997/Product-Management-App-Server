import mongoose, { Document, Schema } from "mongoose";

import { IUser, UserRole } from "../types/user";

const userSchema = new Schema<IUser & Document>(
  {
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
     isRegComplet: {
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
