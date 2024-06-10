import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import logger from '../configs/logger';
import ApiError from '../utils/ApiError';

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    let statusCode: number = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message: string = error.message || (httpStatus[statusCode as keyof typeof httpStatus] as string);

    // Handle Prisma errors specifically
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      statusCode = httpStatus.BAD_REQUEST;
      message = `Prisma error: ${error.message}`;
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = `Unknown error: ${error.message}`;
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = `Rust panic error: ${error.message}`;
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = `Initialization error: ${error.message}`;
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      statusCode = httpStatus.BAD_REQUEST;
      message = `Validation error: ${error.message}`;
    }

    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// Handle error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR as keyof typeof httpStatus] as string;
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
