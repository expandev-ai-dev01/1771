export type ProductStatus = 'ATIVO' | 'INATIVO';

export interface Product {
  product_id: string;
  sku: string;
  name: string;
  description: string | null;
  minimum_stock_level: number;
  current_stock_quantity: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductDTO = {
  sku: string;
  name: string;
  description?: string;
  minimum_stock_level: number;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface PaginatedProducts {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
