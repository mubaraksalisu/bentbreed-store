import { NextFunction, Request, Response } from "express";
import HttpError from "../errors/http.error";
import { ApiResponse } from "../utils/api-response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message =
    err instanceof HttpError ? err.message : "Internal Server Error";

  ApiResponse.error(res, message, statusCode);
};
