import { Router } from "express";
import { isAuth } from "../middleware/isAuth";
import { addToCartController, getCartController, increaseQuantityController } from "../controller/cart.controller";


const router = Router();


router.get("/my-cart", isAuth, getCartController);
router.post("/add-to-cart", isAuth, addToCartController);
router.put("/increase", isAuth, increaseQuantityController);


export default router;
