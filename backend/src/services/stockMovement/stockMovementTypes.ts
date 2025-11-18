import { z } from 'zod';
import { createStockMovementSchema, listStockMovementsSchema } from './stockMovementValidation';

export interface StockMovement {
  id: string;
  product_id: string;
  user_id: number;
  movement_type: 'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'INATIVACAO' | 'CADASTRO';
  quantity: number;
  reason: string | null;
  movement_date: Date;
}

export type CreateStockMovementDTO = z.infer<typeof createStockMovementSchema>;
export type ListStockMovementsFilter = z.infer<typeof listStockMovementsSchema>;
