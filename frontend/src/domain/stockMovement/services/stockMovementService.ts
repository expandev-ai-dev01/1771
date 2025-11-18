import { authenticatedClient } from '@/core/lib/api';
import type {
  StockMovement,
  CreateStockMovementDTO,
  ListStockMovementsFilters,
  PaginatedStockMovements,
} from '../types';

export const stockMovementService = {
  async listStockMovements(filters: ListStockMovementsFilters): Promise<PaginatedStockMovements> {
    const response = await authenticatedClient.get('/stock-movements', { params: filters });
    return response.data.data;
  },

  async createStockMovement(movementData: CreateStockMovementDTO): Promise<StockMovement> {
    const response = await authenticatedClient.post('/stock-movements', movementData);
    return response.data.data;
  },
};
