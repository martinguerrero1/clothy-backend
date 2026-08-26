import {
  addCategory,
  deleteCategory,
  getCategories,
  modifyCategory,
} from "../services/category.service.js";

async function getCategoriesController(req, res, next) {
  try {
    const categories = await getCategories(req.query);
    console.log(req.query);

    res.status(200).json({
      message: "Categorías obtenidas correctamente",
      categories,
    });
  } catch (error) {
    next(error);
  }
}

async function addCategoryController(req, res, next) {
  try {
    const category = await addCategory(req.body);

    res.status(201).json({
      message: "Categoría creada correctamente",
      category,
    });
  } catch (error) {
    next(error);
  }
}

async function modifyCategoryController(req, res, next) {
  try {
    const category = await modifyCategory(req.params.id, req.body);

    res.status(200).json({
      message: "Categoría modificada correctamente",
      category,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteCategoryController(req, res, next) {
  try {
    await deleteCategory(req.params.id);

    res.status(200).json({
      message: "Categoría eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
}

export {
  getCategoriesController,
  addCategoryController,
  modifyCategoryController,
  deleteCategoryController,
};
