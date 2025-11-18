import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productService } from '../services/productService';
import type { CreateProductDTO } from '../types';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: CreateProductDTO) => productService.createProduct(productData),
    onSuccess: () => {
      toast.success('Produto criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error?.message || 'Ocorreu um erro ao criar o produto.';
      toast.error(errorMessage);
    },
  });
};
