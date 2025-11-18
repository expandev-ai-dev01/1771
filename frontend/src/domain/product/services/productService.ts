import { authenticatedClient } from '@/core/lib/api';
import type { Product, CreateProductDTO, UpdateProductDTO, PaginatedProducts } from '../types';

export const productService = {
  async listProducts(page = 1, pageSize = 10): Promise<PaginatedProducts> {
    const response = await authenticatedClient.get('/products', {
      params: { page, pageSize },
    });
    return response.data.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await authenticatedClient.get(`/products/${id}`);
    return response.data.data;
  },

  async createProduct(productData: CreateProductDTO): Promise<Product> {
    const response = await authenticatedClient.post('/products', productData);
    return response.data.data;
  },

  async updateProduct(id: string, productData: UpdateProductDTO): Promise<Product> {
    const response = await authenticatedClient.put(`/products/${id}`, productData);
    return response.data.data;
  },
};
