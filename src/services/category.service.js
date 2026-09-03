import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import { uploadImage, deleteImage } from "./cloudinary.service.js";

export async function getCategories(queryParams) {
  const { search, limit } = queryParams;

  const filters = {
    active: true,
  };

  if (search) {
    filters.name = { $regex: search, $options: "i" };
  }

  let query = CategoryModel.find(filters);

  if (limit) {
    query = query.limit(Number(limit));
  }

  return query;
}

export async function addCategory(categoryData, file) {
  const { name } = categoryData;

  const categoryExists = await CategoryModel.findOne({ name });

  if (categoryExists) {
    throw new Error("La categoría ya existe");
  }

  let image;

  if (file) {
    const fileName = file.originalname.split(".")[0].trim().toLowerCase().replace(/\s+/g, "-");

    image = await uploadImage(file.buffer, "clothy/categories", fileName);
  }

  try {
    return await CategoryModel.create({
      name,
      image,
    });
  } catch (error) {
    if (image?.publicId) {
      await deleteImage(image.publicId);
    }

    throw error;
  }
}

export async function modifyCategory(categoryId, categoryData, file) {
  const { name, active } = categoryData;

  const category = await CategoryModel.findById(categoryId);

  if (!category) {
    throw new Error("La categoría no existe");
  }

  // Modificación de name
  if (name && name !== category.name) {
    const categoryExists = await CategoryModel.findOne({
      name,
      _id: { $ne: categoryId },
    });

    if (categoryExists) {
      throw new Error("Ya existe una categoría con ese nombre");
    }

    category.name = name;
  }

  if (active !== undefined) {
    category.active = active;
  }

  let newImage;
  const oldImagePublicId = category.image?.publicId; //se clona la imagen que estaba para poder eliminarla despues

  if (file) {
    const fileName = file.originalname.split(".")[0].trim().toLowerCase().replace(/\s+/g, "-");

    newImage = await uploadImage(file.buffer, "clothy/categories", fileName);

    category.image = newImage;
  }

  try {
    const updatedCategory = await category.save();

    //si existen ambas elimina la vieja
    if (newImage?.publicId && oldImagePublicId) {
      await deleteImage(oldImagePublicId);
    }
    return updatedCategory;
  } catch (error) {
    if (newImage?.publicId) {
      await deleteImage(newImage.publicId);
    }

    throw error;
  }
}

export async function deleteCategory(categoryId) {
  const category = await CategoryModel.findById(categoryId);

  if (!category) {
    throw new Error("La categoría no existe");
  }

  const productsWithCategory = await ProductModel.exists({
    category: categoryId,
  });

  if (productsWithCategory) {
    throw new Error("No se puede eliminar la categoría porque tiene productos asociados");
  }

  const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

  if (deletedCategory?.image?.publicId) {
    await deleteImage(deletedCategory.image.publicId);
  }

  return deletedCategory;
}
