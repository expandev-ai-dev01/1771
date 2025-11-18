import sql from 'mssql';
import { getPool } from '@/db';
import {
  CreateStockMovementDTO,
  ListStockMovementsFilter,
  StockMovement,
} from './stockMovementTypes';

export const createStockMovement = async (
  movementData: CreateStockMovementDTO & { userId: number }
): Promise<StockMovement> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('product_id', sql.UniqueIdentifier, movementData.product_id)
    .input('user_id', sql.Int, movementData.userId)
    .input('movement_type', sql.NVarChar(20), movementData.movement_type)
    .input('quantity', sql.Int, movementData.quantity)
    .input('reason', sql.NVarChar(255), movementData.reason)
    .execute('spStockMovementCreate');

  return result.recordset[0];
};

export const listStockMovements = async (filters: ListStockMovementsFilter) => {
  const pool = await getPool();
  const request = pool
    .request()
    .input('page', sql.Int, filters.page || 1)
    .input('pageSize', sql.Int, filters.pageSize || 10);

  if (filters.product_id) request.input('product_id', sql.UniqueIdentifier, filters.product_id);
  if (filters.start_date) request.input('start_date', sql.Date, filters.start_date);
  if (filters.end_date) request.input('end_date', sql.Date, filters.end_date);
  if (filters.movement_type)
    request.input('movement_type', sql.NVarChar(20), filters.movement_type);

  const result = await request.execute('spStockMovementList');

  const movements = (result.recordsets as sql.IRecordSet<StockMovement>[])[0];
  const totalCount = (result.recordsets as sql.IRecordSet<{ '': number }>[])[1][0][''];

  return {
    data: movements,
    pagination: {
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
      totalCount,
      totalPages: Math.ceil(totalCount / (filters.pageSize || 10)),
    },
  };
};
