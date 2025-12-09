

export interface ICartItem {
  productId: string;
  quantity: number;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
}
