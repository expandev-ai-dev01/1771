import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/apiResponse';
import * as stockMovementService from '@/services/stockMovement/stockMovementService';
import {
  createStockMovementSchema,
  listStockMovementsSchema,
} from '@/services/stockMovement/stockMovementValidation';

export const createStockMovement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movementData = createStockMovementSchema.parse(req.body);
    // TODO: Replace with actual user ID from auth middleware
    const userId = 1;
    const newMovement = await stockMovementService.createStockMovement({ ...movementData, userId });
    res.status(201).json(successResponse(newMovement));
  } catch (error) {
    next(error);
  }
};

export const listStockMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = listStockMovementsSchema.parse(req.query);
    const result = await stockMovementService.listStockMovements(filters);
    res.status(200).json(successResponse(result.data, { pagination: result.pagination }));
  } catch (error) {
    next(error);
  }
};
