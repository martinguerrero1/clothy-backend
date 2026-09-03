import { Router } from "express";
import {
  getCategoriesController,
  addCategoryController,
  modifyCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller.js";
import { authGuard } from "../middlewares/authGuard.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { validate } from "../middlewares/validate.js";
import upload from "../config/multer.js";
import {
  categoryIdSchema,
  createCategorySchema,
  getCategoriesSchema,
  modifyCategorySchema,
} from "../schemas/category.validation.js";

const router = Router();

router.get("/", validate(getCategoriesSchema, "query"), getCategoriesController);

router.post(
  "/",
  // authGuard,
  // roleGuard,
  upload.single("image"),
  validate(createCategorySchema, "body"),
  addCategoryController
);

router.patch(
  "/:id",
  // authGuard,
  // roleGuard,
  upload.single("image"),
  validate(categoryIdSchema, "params"),
  validate(modifyCategorySchema, "body"),
  modifyCategoryController
);

router.delete(
  "/:id",
  // authGuard,
  // roleGuard,
  validate(categoryIdSchema, "params"),
  deleteCategoryController
);

export default router;
