import { getProducts, getCategories, getOneProduct } from "../services/product.service.js";

async function getProductsController(req, res) {
  try {
    const { products, totalResults, page, limit } = await getProducts(req.query);
    res.status(200).json({
      message: "Productos obtenidos correctamente",
      products,
      totalResults,
      page,
      limit,
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
    res.status(500).json({
      message: "Error al obtener categorias",
      error,
    });
  }
}

async function getOneProductController(req, res) {
  try {
    const id = req.params.id;
    console.log(id);
    const product = await getOneProduct(id);

    res.status(200).json({
      message: "Producto encontrado",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el producto",
      error,
    });
  }
}

export default { getProductsController, getCategoriesController, getOneProductController };
