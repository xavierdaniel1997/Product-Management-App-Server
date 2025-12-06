import { Schema, model, Document } from "mongoose";
import { ICartItem } from "../types/cart";


export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false } 
);

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Cart = model<ICart>("Cart", CartSchema);
