import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { addToCartService, getUserCart, increaseQuantityService } from "../service/cart.service";

const getCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const cart = await getUserCart(userId);
    return sendResponse(res, 200, cart, "Cart fetched successfully");
  } catch (error: any) {
    return sendResponse(res, 500, null, error.message);
  }
};

const addToCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    console.log("checking the userId..............", userId)
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return sendResponse(res, 400, null, "productId and quantity required");
    }

    const cart = await addToCartService(userId, productId, quantity);
    return sendResponse(res, 200, cart, "Product added to cart");
  } catch (error: any) {
    return sendResponse(res, 500, null, error.message);
  }
};

const increaseQuantityController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return sendResponse(res, 400, null, "productId and quantity required");
    }

    const cart = await increaseQuantityService(userId, productId, quantity);
    return sendResponse(res, 200, cart, "Cart quantity updated");
  } catch (error: any) {
    return sendResponse(res, 500, null, error.message);
  }
};

// export const removeFromCartController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const userId = req.user.id;
//     const { productId } = req.body;

//     if (!productId) {
//       return sendResponse(res, 400, null, "productId required");
//     }

//     const cart = await removeFromCartService(userId, productId);
//     return sendResponse(res, 200, cart, "Product removed from cart");
//   } catch (error: any) {
//     return sendResponse(res, 500, null, error.message);
//   }
// };

export {getCartController, addToCartController, increaseQuantityController}