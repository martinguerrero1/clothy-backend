import { Router } from "express";
import {
  getCartController,
  addItemController,
  updateItemController,
  removeItemController,
  clearCartController,
  createCartController,
} from "../controllers/cart.controller.js";
import { authGuard } from "../middlewares/authGuard.js";
import { roleGuard } from "../middlewares/roleGuard.js";

const router = Router();

router.use(authGuard);

router.get("/", getCartController);
router.post("/admin", roleGuard, createCartController);
router.post("/", addItemController);
router.patch("/:productId", updateItemController);
router.delete("/:productId", removeItemController);
router.delete("/", clearCartController);

export default router;
