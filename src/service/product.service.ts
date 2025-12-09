import ProductModel from "../models/product.model";
import { IProduct } from "../types/product";

export const createProductService = async (payload: IProduct) => {
  return await ProductModel.create(payload);
};

// export const getAllProductsService = async () => {
//   return await ProductModel.find().sort({ createdAt: -1 });
// };

export const getAllProductsService = async (filters: {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  const query: any = {};

  // SEARCH BY NAME (case-insensitive)
  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" };
  }

  // PRICE FILTER
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }

  return await ProductModel.find(query).sort({ createdAt: -1 });
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


export const getAllProductsPaginatedService = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  const {
    page = 1,
    limit = 10,
    search,
    minPrice,
    maxPrice
  } = params;

  const query: any = {};


  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ProductModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    ProductModel.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

