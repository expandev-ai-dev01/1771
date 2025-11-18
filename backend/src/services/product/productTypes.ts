import { z } from 'zod';
import { createProductSchema, updateProductSchema } from './productValidation';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  minimum_stock_level: number;
  current_stock_quantity: number;
  status: 'ATIVO' | 'INATIVO';
  created_at: Date;
  updated_at: Date;
}

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
