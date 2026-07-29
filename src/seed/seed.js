import mongoose from "mongoose";
import conectarDB from "../config/db.js";
import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import categories from "./categories.js";
import products from "./products.js";

async function seed() {
  try {
    await conectarDB();

    await CategoryModel.deleteMany({});
    await ProductModel.deleteMany({});

    const createdCategories = await CategoryModel.insertMany(categories);

    const categoriesId = createdCategories.reduce((obj, category) => {
      obj[category.slug] = category._id;
      return obj;
    }, {});

    const newProducts = products.map((product) => {
      return { ...product, category: categoriesId[product.category] };
    });

    const createdProducts = await ProductModel.insertMany(newProducts);

    await mongoose.disconnect();
    console.log("✅ Seed ejecutada correctamente");
  } catch (error) {
    console.log(error);
    await mongoose.disconnect();
  }
}

seed();
