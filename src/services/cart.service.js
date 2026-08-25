import CartModel from "../models/cart.model.js";

export async function getCart(userId) {
  const cart = await CartModel.findOne({ user: userId }).populate("items.product");
  // console.log("cart",cart)
  if (!cart) {
    throw new Error("El carrito no existe");
  }

  return cart;
}

export async function addItem(userId, productId, quantity) {
  const cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    throw new Error("El carrito no existe");
  }

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    const error = new Error("El producto ya está en el carrito");
    error.statusCode = 409;

    throw error;
  }

  cart.items.push({
    product: productId,
    quantity,
  });

  await cart.save();

  return cart;
}

export async function updateItem(userId, productId, quantity) {
  const cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    throw new Error("El carrito no existe");
  }

  //find() para saber si existe el item en el carrito
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  //si existe, error
  if (!existingItem) {
    throw new Error("El producto no existe en el carrito");
  }

  //modificamos cantidad
  existingItem.quantity = quantity;

  await cart.save();

  return cart;
}

export async function removeItem(userId, productId) {
  const cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    throw new Error("El carrito no existe");
  }

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (!existingItem) {
    throw new Error("El producto no existe en el carrito");
  }

  cart.items.pull(existingItem);

  await cart.save();

  return cart;
}

export async function clearCart(userId) {
  const cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    throw new Error("El carrito no existe");
  }

  if (cart.items.length === 0) {
    throw new Error("El carrito ya está vacio");
  }

  cart.items = [];

  await cart.save();

  return cart;
}
