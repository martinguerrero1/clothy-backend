// product.service.js

import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import { deleteImage, uploadImage } from "./cloudinary.service.js";

// =====================================================
// GET PRODUCTS
// =====================================================

export async function getProducts(queryParams) {
  const { search, category, gender, minPrice, maxPrice, sort, limit, page = 1 } = queryParams;

  const filters = {
    active: true,
  };

  // SEARCH
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // CATEGORY
  if (category) {
    const categoryFound = await CategoryModel.findOne({
      slug: category,
      active: true,
    });

    if (!categoryFound) {
      return {
        products: [],
        totalResults: 0,
        page,
        limit: 12,
      };
    }

    filters.category = categoryFound._id;
  }

  // GENDER
  if (gender) {
    filters.gender = gender;
  }

  // PRICE
  if (minPrice || maxPrice) {
    filters.price = {};

    if (minPrice) {
      filters.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filters.price.$lte = Number(maxPrice);
    }
  }

  const totalResults = await ProductModel.countDocuments(filters);

  let query = ProductModel.find(filters).populate("category", "name slug");

  // SORT
  switch (sort) {
    case "best-sellers":
      query = query.sort({ unitsSold: -1 });
      break;

    case "newest":
      query = query.sort({ createdAt: -1 });
      break;

    case "price-asc":
      query = query.sort({ price: 1 });
      break;

    case "price-desc":
      query = query.sort({ price: -1 });
      break;
  }

  // LIMIT
  const requestedLimit = Number(limit);

  const allowedLimit =
    Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 12) : 12;

  // PAGINATION
  const currentPage = Number(page);
  const skip = (currentPage - 1) * allowedLimit;

  query = query.skip(skip).limit(allowedLimit);

  const products = await query;

  return {
    products,
    totalResults,
    page: currentPage,
    limit: allowedLimit,
  };
}

// =====================================================
// GET PRODUCT BY ID
// =====================================================

export async function getProductById(id) {
  const product = await ProductModel.findOne({
    _id: id,
    active: true,
  }).populate("category", "name slug");

  return product;
}

// =====================================================
// ADD PRODUCT
// =====================================================

export async function addProduct(productData, files) {
  const { name, description, price, stock, category, gender } = productData;

  // Verificar que la categoría exista y esté activa
  const categoryFound = await CategoryModel.findOne({
    _id: category,
    active: true,
  });

  if (!categoryFound) {
    return null;
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Crear producto inicialmente sin imágenes
  const product = await ProductModel.create({
    name,
    slug,
    description,
    price,
    stock,
    category: categoryFound._id,
    gender,
    images: [],
  });

  // Subir imágenes a Cloudinary
  const images = [];

  if (files?.length) {
    for (const file of files) {
      const result = await uploadImage(
        file.buffer,
        `clothy/products/${product._id}`,
        file.originalname.split(".")[0].trim().toLowerCase().replace(/\s+/g, "-")
      );

      images.push(result);
    }
  }

  // Agregar las imágenes al producto
  product.images = images;

  await product.save();

  return await product.populate("category", "name slug");
}

// =====================================================
// MODIFY PRODUCT
// =====================================================

export async function modifyProduct(id, productData, files) {
  const product = await ProductModel.findById(id);

  if (!product) {
    return null;
  }

  const { name, description, price, stock, category, gender, active } = productData;

  // Si se manda una categoría nueva, verificar que exista
  if (category) {
    const categoryFound = await CategoryModel.findOne({
      _id: category,
      active: true,
    });

    if (!categoryFound) {
      return null;
    }

    product.category = categoryFound._id;
  }

  // Actualizar campos enviados
  if (name !== undefined) {
    product.name = name;
    product.slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  if (description !== undefined) {
    product.description = description;
  }
  if (price !== undefined) {
    product.price = price;
  }
  if (stock !== undefined) {
    product.stock = stock;
  }
  if (gender !== undefined) {
    product.gender = gender;
  }

  // Si se reciben nuevas imágenes,
  // eliminamos las anteriores de Cloudinary
  if (files?.length) {
    for (const image of product.images) {
      await deleteImage(image.publicId);
    }

    const newImages = [];

    for (const file of files) {
      const result = await uploadImage(
        file.buffer,
        `clothy/products/${product._id}`,
        file.originalname.split(".")[0].trim().toLowerCase().replace(/\s+/g, "-")
      );

      newImages.push(result);
    }

    product.images = newImages;
  }

  if (active !== undefined) {
    product.active = active;
  }

  await product.save();

  return await product.populate("category", "name slug");
}

// =====================================================
// DEACTIVATE PRODUCT
// =====================================================

export async function deactivateProduct(id) {
  const product = await ProductModel.findById(id);

  if (!product) {
    return null;
  }

  // Soft delete
  product.active = false;

  await product.save();

  return product;
}

// =====================================================
// PERMANENTLY DELETE PRODUCT
// =====================================================

export async function deleteProduct(id) {
  const product = await ProductModel.findById(id);

  if (!product) {
    return null;
  }

  // Eliminar imágenes de Cloudinary
  for (const image of product.images) {
    await deleteImage(image.publicId);
  }

  // Eliminar producto definitivamente de MongoDB
  await ProductModel.findByIdAndDelete(id);

  return product;
}
