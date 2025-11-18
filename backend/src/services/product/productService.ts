import sql from 'mssql';
import { getPool } from '@/db';
import { Product, CreateProductDTO, UpdateProductDTO } from './productTypes';

export const createProduct = async (
  productData: CreateProductDTO & { userId: number }
): Promise<Product> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('sku', sql.NVarChar(50), productData.sku)
    .input('name', sql.NVarChar(150), productData.name)
    .input('description', sql.NVarChar(sql.MAX), productData.description)
    .input('minimum_stock_level', sql.Int, productData.minimum_stock_level)
    .input('user_id', sql.Int, productData.userId)
    .execute('spProductCreate');

  return result.recordset[0];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const pool = await getPool();
  const result = await pool.request().input('id', sql.UniqueIdentifier, id).execute('spProductGet');

  return result.recordset[0] || null;
};

export const listProducts = async (page: number, pageSize: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('page', sql.Int, page)
    .input('pageSize', sql.Int, pageSize)
    .execute('spProductList');

  const products = (result.recordsets as sql.IRecordSet<Product>[])[0];
  const totalCount = (result.recordsets as sql.IRecordSet<{ total_count: number }>[])[1][0]
    .total_count;

  return {
    data: products,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
};

export const updateProduct = async (
  id: string,
  productData: UpdateProductDTO
): Promise<Product | null> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.UniqueIdentifier, id)
    .input('name', sql.NVarChar(150), productData.name)
    .input('description', sql.NVarChar(sql.MAX), productData.description)
    .input('minimum_stock_level', sql.Int, productData.minimum_stock_level)
    .execute('spProductUpdate');

  return result.recordset[0] || null;
};
