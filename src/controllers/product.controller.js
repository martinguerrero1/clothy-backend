import { getProducts } from "../services/product.services.js";

async function getProductsController(req, res) {
  try {
    const products = await getProducts();

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

export default { getProductsController };
