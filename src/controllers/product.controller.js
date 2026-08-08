import { getProducts, getCategories } from "../services/product.services.js";

async function getProductsController(req, res) {
  try {
    const products = await getProducts(req.query);

    res.status(200).json({
      message: "Productos obtenidos correctamente",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener productos",
      error,
    });
  }
}

async function getCategoriesController(req, res) {
  try {
    const categories = await getCategories(req.query);

    res.status(200).json({
      message: "Categorias obtenidas correctamente",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener categorias",
      error,
    });
  }
}

export default { getProductsController, getCategoriesController };
