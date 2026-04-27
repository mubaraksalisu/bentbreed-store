import { NextFunction, Request, Response } from "express";
import HttpError from "../errors/http.error";
import { ApiResponse } from "../utils/api-response";
import logger from "../logger/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    logger.warn(err.message);
  } else {
    logger.error(err.message, { stack: err.stack || err });
  }

  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message =
    err instanceof HttpError ? err.message : "Internal Server Error";

  ApiResponse.error(res, message, statusCode);
};
