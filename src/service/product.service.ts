import ProductModel from "../models/product.model";
import { IProduct } from "../types/product";

export const createProductService = async (payload: IProduct) => {
  return await ProductModel.create(payload);
};

export const getAllProductsService = async () => {
  return await ProductModel.find().sort({ createdAt: -1 });
};

export const getProductByIdService = async (id: string) => {
  return await ProductModel.findById(id);
};

export const updateProductService = async (
  id: string,
  payload: Partial<IProduct>
) => {
  return await ProductModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

export const deleteProductService = async (id: string) => {
  return await ProductModel.findByIdAndDelete(id);
};