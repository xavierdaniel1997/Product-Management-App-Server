import { Types } from "mongoose";

export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
   createdBy: Types.ObjectId;  
  createdAt: Date;
  updatedAt: Date;
}
