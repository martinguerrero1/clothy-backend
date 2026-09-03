import {
  getProducts,
  getProductById,
  addProduct,
  modifyProduct,
  deactivateProduct,
  deleteProduct,
} from "../services/product.service.js";

// =====================================================
// GET PRODUCTS
// =====================================================

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
    res.status(500).json({
      message: "Error al obtener productos",
      error,
    });
  }
}

// =====================================================
// GET PRODUCT BY ID
// =====================================================

async function getProductByIdController(req, res) {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

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

// =====================================================
// ADD PRODUCT
// =====================================================

async function addProductController(req, res) {
  try {
    const product = await addProduct(req.body, req.files);

    if (!product) {
      return res.status(404).json({
        message: "La categoría indicada no existe o está inactiva",
      });
    }

    res.status(201).json({
      message: "Producto creado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el producto",
      error,
    });
  }
}

// =====================================================
// MODIFY PRODUCT
// =====================================================

async function modifyProductController(req, res) {
  try {
    const { id } = req.params;

    const product = await modifyProduct(id, req.body, req.files);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado o categoría inválida",
      });
    }

    res.status(200).json({
      message: "Producto modificado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al modificar el producto",
      error,
    });
  }
}

// =====================================================
// DEACTIVATE PRODUCT
// =====================================================

async function deactivateProductController(req, res) {
  try {
    const { id } = req.params;

    const product = await deactivateProduct(id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      message: "Producto desactivado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al desactivar el producto",
      error,
    });
  }
}

// =====================================================
// PERMANENTLY DELETE PRODUCT
// =====================================================

async function deleteProductController(req, res) {
  try {
    const { id } = req.params;

    const product = await deleteProduct(id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      message: "Producto eliminado definitivamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto",
      error,
    });
  }
}

export {
  getProductsController,
  getProductByIdController,
  addProductController,
  modifyProductController,
  deactivateProductController,
  deleteProductController,
};
