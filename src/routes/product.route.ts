import express from 'express';
import { isAdmin, isAuth } from '../middleware/isAuth';
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProductController } from '../controller/product.controller';
import { upload } from '../middleware/multer';

const router = express.Router();

router.post("/add-product", isAuth, isAdmin, upload.array("images", 5), addProductController)
router.get("/all-products", getProductsController)
router.get("/product-details/:productId", isAuth, getProductByIdController)
router.put("/update-product/:productId", isAuth, isAdmin,  upload.array("images", 5), updateProductController)
router.delete("/delete-product/:productId", isAuth, isAdmin, deleteProductController)

export default router;