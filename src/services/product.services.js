import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";

export async function getProducts(queryParams) {
  const { search, category, gender, minPrice, maxPrice, sort, limit } = queryParams;

  const filters = {
    active: true,
  };

  //SEARCH--------------
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  //CATEGORY--------------
  if (category) {
    const categoryFound = await CategoryModel.findOne({
      slug: category,
      active: true,
    });

    if (!categoryFound) {
      return [];
    }

    filters.category = categoryFound.id;
  }

  //GENDER-----------------
  if (gender) {
    filters.gender = gender;
  }

  //PRICES--------------
  if (minPrice || maxPrice) {
    filters.price = {};
  }

  if (minPrice) {
    filters.price.$gte = Number(minPrice);
  }

  if (maxPrice) {
    filters.price.$lte = Number(maxPrice);
  }

  //QUERY CREATION
  let query = ProductModel.find(filters).populate("category", "name slug");

  //SORT--------------
  if (sort === "best-sellers") {
    query = query.sort({ unitsSold: -1 });
  }

  //LIMIT----------------
  if (limit) {
    query = query.limit(Number(limit));
  }

  return await query;
}

export async function getCategories(queryParams) {
  const { search, name, limit } = queryParams;

  const filters = {
    active: true,
  };

  if (search) {
    filters.name = { $regex: search, $options: "i" };
  }

  if (name) {
    const nameFound = await CategoryModel.findOne({ name });
    filters.name = nameFound;
  }

  let query = CategoryModel.find(filters);

  if (limit) {
    query = query.limit(Number(limit));
  }

  return query;
}
