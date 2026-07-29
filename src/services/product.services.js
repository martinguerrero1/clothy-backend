import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";

export async function getProducts(queryParams) {
  const products = await ProductModel.find({ active: true }).populate("category", "name slug");

  return products;
}
