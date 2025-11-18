import { z } from 'zod';

const movementTypes = z.enum(['ENTRADA', 'SAIDA', 'AJUSTE', 'INATIVACAO', 'CADASTRO']);

export const createStockMovementSchema = z
  .object({
    product_id: z.string().uuid('Invalid product ID format'),
    movement_type: movementTypes,
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    reason: z.string().max(255).optional().nullable(),
  })
  .refine(
    (data) => {
      if ((data.movement_type === 'SAIDA' || data.movement_type === 'AJUSTE') && !data.reason) {
        return false;
      }
      return true;
    },
    { message: 'Reason is required for SAIDA or AJUSTE movements' }
  );

export const listStockMovementsSchema = z.object({
  product_id: z.string().uuid().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  movement_type: movementTypes.optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});
