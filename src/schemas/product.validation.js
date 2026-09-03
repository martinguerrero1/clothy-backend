import { z } from "zod";

// =====================================================
// GET PRODUCTS
// =====================================================

export const getProductsSchema = z.object({
  search: z.string().trim().optional(),

  category: z.string().trim().optional(),

  gender: z.enum(["hombre", "mujer", "unisex"]).optional(),

  minPrice: z.coerce.number().min(0).optional(),

  maxPrice: z.coerce.number().min(0).optional(),

  sort: z.enum(["best-sellers", "newest"]).optional(),

  limit: z.coerce.number().int().positive().max(12).optional(),

  page: z.coerce.number().int().positive().optional(),
});

// =====================================================
// ADD PRODUCT
// =====================================================

export const addProductSchema = z.object({
  name: z.string().trim().min(3).max(50),

  description: z.string().trim().max(1000),

  price: z.coerce.number().min(0),

  stock: z.coerce.number().int().min(0).default(0),

  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de categoría inválido"),

  gender: z.enum(["hombre", "mujer", "unisex"]),
});

// =====================================================
// MODIFY PRODUCT
// =====================================================

export const modifyProductSchema = z
  .object({
    name: z.string().trim().min(3).max(50).optional(),

    description: z.string().trim().max(1000).optional(),

    price: z.coerce.number().min(0).optional(),

    stock: z.coerce.number().int().min(0).optional(),

    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "ID de categoría inválido")
      .optional(),

    gender: z.enum(["hombre", "mujer", "unisex"]).optional(),

    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para modificar",
  });

// =====================================================
// PRODUCT ID SCHEMA
// =====================================================

export const ProductIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de producto inválido"),
});
