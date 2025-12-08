import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { uploadMultipleToCloudinary } from "../utils/uploadAssetToCloudinary";
import { createProductService, deleteProductService, getAllProductsService, getProductByIdService, updateProductService } from "../service/product.service";

const addProductController = async (req: Request, res: Response) => {
    try{
        const {productName, price, description} = req.body;
        const userId = req.user._id;
        let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      images = await uploadMultipleToCloudinary(req.files, {
        folder: "MyStore/myProducts",
        resource_type: "image",
      });
    }
     const product = await createProductService({
      name: productName,
      price: Number(price),
      description,
      images,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
        sendResponse(res, 200, product, "Product created successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to create the product")
    }
}

const getProductsController = async (req: Request, res: Response) => {
  try {
    const { search, minPrice, maxPrice } = req.query;

    const query: { search?: string; minPrice?: number; maxPrice?: number } = {};
    if (search) query.search = search as string;
    if (minPrice !== undefined) query.minPrice = Number(minPrice);
    if (maxPrice !== undefined) query.maxPrice = Number(maxPrice);

    const products = await getAllProductsService(query);
    
    sendResponse(res, 200, products, "Products fetched successfully");
  } catch (error: any) {
    sendResponse(res, 400, null, "Failed to fetch products");
  }
};

const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    console.log("checking the productId", productId)
    if(!productId){
        throw new Error("Product _id not found")
    }
    const product = await getProductByIdService(productId);

    if (!product) {
      return sendResponse(res, 404, null, "Product not found");
    }
    console.log("products form the getProductById", product)
    sendResponse(res, 200, product, "Product fetched successfully");
  } catch (error: any) {
    sendResponse(res, 400, null, "Failed to fetch product");
  }
};


const updateProductController = async (req: Request, res: Response) => {
  try {

     const productId = req.params.productId;
    if(!productId){
        throw new Error("Product _id not found")
    }
    const { productName, price, description } = req.body;

    let images: string[] = [];

    if (req.files && Array.isArray(req.files)) {
      images = await uploadMultipleToCloudinary(req.files, {
        folder: "MyStore/myProducts",
        resource_type: "image",
      });
    }

    const payload: any = {};

    if (productName) payload.name = productName;
    if (price) payload.price = price;
    if (description) payload.description = description;
    if (images.length > 0) payload.images = images;

    const updated = await updateProductService(productId, payload);

    sendResponse(res, 200, updated, "Product updated successfully");
  } catch (error: any) {
    sendResponse(res, 400, null, "Failed to update product");
  }
};


const deleteProductController = async (req: Request, res: Response) => {
  try {
       const productId = req.params.productId;
    if(!productId){
        throw new Error("Product _id not found")
    }
    const deleted = await deleteProductService(productId);

    if (!deleted) {
      return sendResponse(res, 404, null, "Product not found");
    }

    sendResponse(res, 200, deleted, "Product deleted successfully");
  } catch (error: any) {
    sendResponse(res, 400, null, "Failed to delete product");
  }
};





export {addProductController, getProductsController, getProductByIdController, updateProductController, deleteProductController}