import CartModel from "../models/cart.model";
import ProductModel from "../models/product.model";


export const getUserCart = async (userId: string) => {
  let cart = await CartModel.findOne({ userId }).populate("items.productId");
  if (!cart) cart = await CartModel.create({ userId, items: [] });
  return cart;
};


const validateStock = async (productId: string, requiredQty: number) => {
  const product = await ProductModel.findById(productId);

  if (!product) throw new Error("Product not found");
  if (product.stock <= 0) throw new Error("Product is out of stock");

  if (requiredQty > product.stock) {
    throw new Error("Insufficient stock available");
  }

  return product;
};


export const addToCartService = async (
  userId: string,
  productId: string,
  qty: number
) => {
  if (qty <= 0) throw new Error("Invalid quantity");

  const cart = await getUserCart(userId);

  const existingItem = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  const newQty = existingItem ? existingItem.quantity + qty : qty;

  await validateStock(productId, newQty);

  if (existingItem) {
    existingItem.quantity = newQty;
  } else {
    cart.items.push({ productId, quantity: qty });
  }

  await cart.save();
  return cart;
};


export const increaseQuantityService = async (
  userId: string,
  productId: string,
  qty: number
) => {
  return addToCartService(userId, productId, qty);
};


// export const decreaseQuantityService = async (
//   userId: string,
//   productId: string,
//   qty: number
// ) => {
//   if (qty <= 0) throw new Error("Invalid quantity");

//   const cart = await getUserCart(userId);

//   const item = cart.items.find(
//     (i) => i.productId.toString() === productId
//   );

//   if (!item) throw new Error("Item not found in cart");

//   const updatedQty = item.quantity - qty;

//   if (updatedQty < 0) throw new Error("Quantity cannot be negative");

//   if (updatedQty === 0) {
//     cart.items.pull(item._id);
//   } else {
//     item.quantity = updatedQty;
//   }

//   await cart.save();
//   return cart;
// };


// export const removeFromCartService = async (
//   userId: string,
//   productId: string
// ) => {
//   const cart = await getUserCart(userId);

//   const item = cart.items.find(
//     (i) => i.productId.toString() === productId
//   );

//   if (!item) throw new Error("Item not found in cart");

//   cart.items.pull(item._id);

//   await cart.save();
//   return cart;
// };


export const clearCartService = async (userId: string) => {
  const cart = await getUserCart(userId);

  cart.items = []; 

  await cart.save();
  return cart;
};


export const getCartService = async (userId: string) => {
  const cart = await getUserCart(userId);
  return cart;
};
