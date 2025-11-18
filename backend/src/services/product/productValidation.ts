import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must be at most 50 characters'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(150, 'Name must be at most 150 characters'),
  description: z.string().optional().nullable(),
  minimum_stock_level: z
    .number()
    .int()
    .nonnegative('Minimum stock level cannot be negative')
    .default(0),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).max(150),
  description: z.string().optional().nullable(),
  minimum_stock_level: z.number().int().nonnegative(),
});
