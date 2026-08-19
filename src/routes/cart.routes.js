import { Router } from "express";
import {
  getCartController,
  addItemController,
  updateItemController,
  removeItemController,
  clearCartController,
} from "../controllers/cart.controller.js";
import { authGuard } from "../middlewares/authGuard.js";

const router = Router();

router.use(authGuard);

router.get("/", getCartController);
router.post("/", addItemController);
router.patch("/:productId", updateItemController);
router.delete("/:productId", removeItemController);
router.delete("/", clearCartController);

export default router;
