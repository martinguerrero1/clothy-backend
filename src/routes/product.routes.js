import { Router } from "express";
import controller from "../controllers/product.controller.js";

const router = Router();

router.get("/", controller.getProductsController);
router.get("/categories", controller.getCategoriesController);

export default router;
