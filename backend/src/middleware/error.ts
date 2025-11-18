import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '@/config';

interface ApiError extends Error {
  statusCode: number;
}

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input provided.',
        details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
      },
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      ...(config.env === 'development' && { stack: err.stack }),
    },
  });
};
