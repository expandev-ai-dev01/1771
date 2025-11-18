export type MovementType = 'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'INATIVACAO' | 'CADASTRO';

export interface StockMovement {
  movement_id: string;
  product_id: string;
  user_id: number;
  movement_type: MovementType;
  quantity: number;
  reason: string | null;
  movement_date: string;
  product?: {
    sku: string;
    name: string;
  };
}

export type CreateStockMovementDTO = {
  product_id: string;
  movement_type: MovementType;
  quantity: number;
  reason?: string;
};

export interface ListStockMovementsFilters {
  page?: number;
  pageSize?: number;
  product_id?: string;
  movement_type?: MovementType;
  start_date?: string;
  end_date?: string;
}

export interface PaginatedStockMovements {
  data: StockMovement[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
