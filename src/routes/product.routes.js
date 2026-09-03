import { Router } from "express";
import {
  getProductsController,
  getProductByIdController,
  addProductController,
  modifyProductController,
  deactivateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  addProductSchema,
  getProductsSchema,
  modifyProductSchema,
  ProductIdSchema,
} from "../schemas/product.validation.js";
import { authGuard } from "../middlewares/authGuard.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import upload from "../config/multer.js";

const router = Router();

router.get("/", validate(getProductsSchema, "query"), getProductsController);

router.get("/:id", validate(ProductIdSchema, "params"), getProductByIdController);

router.post(
  "/",
  authGuard,
  roleGuard,
  upload.array("images", 5),
  validate(addProductSchema, "body"),
  addProductController
);

router.patch(
  "/:id",
  authGuard,
  roleGuard,
  upload.array("images", 5),
  validate(ProductIdSchema, "params"),
  validate(modifyProductSchema, "body"),
  modifyProductController
);

router.delete(
  "/:id",
  authGuard,
  roleGuard,
  validate(ProductIdSchema, "params"),
  deactivateProductController
);

if (process.env.NODE_ENV === "development") {
  router.delete(
    "/:id/permanent",
    authGuard,
    roleGuard,
    validate(ProductIdSchema, "params"),
    deleteProductController
  );
}

export default router;
