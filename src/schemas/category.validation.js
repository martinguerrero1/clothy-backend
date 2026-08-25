import { z } from "zod";

export const getCategoriesSchema = z.object({
  // string() valida que sea string
  // optional() permite que el parámetro no sea enviado.
  search: z.string().optional(),

  // coerce.number() convierte automáticamente "10" → 10.
  // int() exige que sea un número entero.
  // positive() exige que sea mayor que 0.
  // optional() permite no enviar limit.
  limit: z.coerce.number().int().positive().optional(),
});

export const createCategorySchema = z.object({
  // min(1) exige que tenga al menos un carácter.
  name: z.string().min(1),
});

export const modifyCategorySchema = z.object({
  name: z.string().min(1).optional(),

  // boolean() valida que sea booleano
  // optional() permite modificar solamente name sin enviar active.
  active: z.boolean().optional(),
});

export const categoryIdSchema = z.object({
  id: z.string().min(1),
});
