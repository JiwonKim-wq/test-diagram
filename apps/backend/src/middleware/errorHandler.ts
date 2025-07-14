import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // 로그 기록
  logger.error(err);

  // 개발 환경에서는 상세 에러 정보 제공
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      stack: err.stack
    });
  } else {
    // 프로덕션 환경에서는 간단한 에러 메시지만 제공
    res.status(error.statusCode || 500).json({
      success: false,
      error: 'Something went wrong'
    });
  }
}; 