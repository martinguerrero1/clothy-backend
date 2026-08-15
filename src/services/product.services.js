import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";

export async function getProducts(queryParams) {
  const { search, category, gender, minPrice, maxPrice, sort, limit, page = 1 } = queryParams;

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

  const totalResults = await ProductModel.countDocuments(filters).populate("category", "name slug");
  //QUERY CREATION
  let query = ProductModel.find(filters).populate("category", "name slug");

  //SORT--------------
  switch (sort) {
    case "best-sellers":
      query = query.sort({ unitsSold: -1 });
      break;
    case "newest":
      query = query.sort({ createdAt: -1 });
      break;
  }

  //LIMIT----------------
  const requestedLimit = Number(limit);

  const allowedLimit =
    Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 12) : 12;

  //PAGINATION------------
  const skip = (page - 1) * allowedLimit;
  query = query.skip(skip).limit(allowedLimit);

  return await {
    products: await query,
    totalResults,
    page,
    limit: allowedLimit,
  };
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
