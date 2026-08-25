import CategoryModel from "../models/category.model";
import ProductModel from "../models/product.model";

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

export async function addCategory(categoryData) {
  const { name } = categoryData;

  const categoryExists = await CategoryModel.findOne({ name });

  if (categoryExists) {
    throw new Error("La categoría ya existe");
  }

  return CategoryModel.create({
    name,
  });
}

export async function modifyCategory(categoryId, categoryData) {
  const { name, active } = categoryData;

  const category = await CategoryModel.findById(categoryId);

  if (!category) {
    throw new Error("La categoría no existe");
  }

  //modificacion de name
  if (name && name !== category.name) {
    //verifica que no sea el mismo name de la cat actual
    const categoryExists = await CategoryModel.findOne({
      name,
      _id: { $ne: categoryId },
    });

    if (categoryExists) {
      //verifica que no exista otra cat con ese name
      throw new Error("Ya existe una categoría con ese nombre");
    }

    category.name = name;
  }

  if (active !== undefined) {
    category.active = active;
  }

  return category.save();
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

  return CategoryModel.findByIdAndDelete(categoryId);
}
