import { useQuery } from '@tanstack/react-query';
import { stockMovementService } from '../services/stockMovementService';
import type { ListStockMovementsFilters } from '../types';

export const useStockMovements = (filters: ListStockMovementsFilters) => {
  return useQuery({
    queryKey: ['stockMovements', filters],
    queryFn: () => stockMovementService.listStockMovements(filters),
    placeholderData: (previousData) => previousData,
  });
};
