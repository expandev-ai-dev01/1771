import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { stockMovementService } from '../services/stockMovementService';
import type { CreateStockMovementDTO } from '../types';

export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movementData: CreateStockMovementDTO) =>
      stockMovementService.createStockMovement(movementData),
    onSuccess: () => {
      toast.success('Movimentação registrada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockMovements'] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error?.message || 'Ocorreu um erro ao registrar a movimentação.';
      toast.error(errorMessage);
    },
  });
};
