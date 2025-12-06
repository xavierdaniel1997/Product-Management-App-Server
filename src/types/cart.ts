export interface ICartItem {
  productId: string;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}
