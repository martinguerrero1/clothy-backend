import { getCart, addItem, clearCart, removeItem, updateItem } from "../services/cart.service.js";

export async function getCartController(req, res) {
  try {
    const userId = req.user.id;

    const cart = await getCart(userId);

    res.status(200).json({
      message: "Carrito encontrado",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un error",
      error: error.message,
    });
  }
}

export async function addItemController(req, res) {
  try {
    const userId = req.user.id;

    const { productId, quantity } = req.body;

    const cart = await addItem(userId, productId, quantity);

    res.status(201).json({
      message: `Se agrego el item al carrito`,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un error",
      error: error.message,
    });
  }
}

export async function updateItemController(req, res) {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const { quantity } = req.body;

    const cart = await updateItem(userId, productId, quantity);

    res.status(200).json({
      message: `Se actualizo el item al carrito`,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un error",
      error: error.message,
    });
  }
}

export async function removeItemController(req, res) {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const cart = await removeItem(userId, productId);

    res.status(200).json({
      message: `Producto eliminado del carrito`,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un error",
      error: error.message,
    });
  }
}

export async function clearCartController(req, res) {
  try {
    const userId = req.user.id;

    const cart = await clearCart(userId);

    res.status(200).json({
      message: `Carrito vaciado`,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un error",
      error: error.message,
    });
  }
}
