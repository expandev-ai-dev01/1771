import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const useProducts = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['products', { page, pageSize }],
    queryFn: () => productService.listProducts(page, pageSize),
    placeholderData: (previousData) => previousData,
  });
};
