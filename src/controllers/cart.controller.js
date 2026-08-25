import { getCart, addItem, clearCart, removeItem, updateItem } from "../services/cart.service.js";

export async function getCartController(req, res, next) {
  try {
    const userId = req.user.id;

    const cart = await getCart(userId);

    res.status(200).json({
      message: "Carrito encontrado",
      cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function addItemController(req, res, next) {
  try {
    const userId = req.user.id;

    const { productId, quantity } = req.body;

    const cart = await addItem(userId, productId, quantity);

    res.status(201).json({
      message: `Se agrego el item al carrito`,
      cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateItemController(req, res, next) {
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
    next(error);
  }
}

export async function removeItemController(req, res, next) {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const cart = await removeItem(userId, productId);

    res.status(200).json({
      message: `Producto eliminado del carrito`,
      cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function clearCartController(req, res, next) {
  try {
    const userId = req.user.id;

    const cart = await clearCart(userId);

    res.status(200).json({
      message: `Carrito vaciado`,
      cart,
    });
  } catch (error) {
    next(error);
  }
}
