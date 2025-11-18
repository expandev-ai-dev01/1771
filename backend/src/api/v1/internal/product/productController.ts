import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/apiResponse';
import * as productService from '@/services/product/productService';
import { createProductSchema, updateProductSchema } from '@/services/product/productValidation';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = createProductSchema.parse(req.body);
    // TODO: Replace with actual user ID from auth middleware
    const userId = 1;
    const newProduct = await productService.createProduct({ ...productData, userId });
    res.status(201).json(successResponse(newProduct));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }
    res.status(200).json(successResponse(product));
  } catch (error) {
    next(error);
  }
};

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const result = await productService.listProducts(page, pageSize);
    res.status(200).json(successResponse(result.data, { pagination: result.pagination }));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const productData = updateProductSchema.parse(req.body);
    const updatedProduct = await productService.updateProduct(id, productData);
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }
    res.status(200).json(successResponse(updatedProduct));
  } catch (error) {
    next(error);
  }
};
