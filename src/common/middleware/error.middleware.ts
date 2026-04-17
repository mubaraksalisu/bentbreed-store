import { NextFunction, Request, Response } from "express";
import HttpError from "../errors/http.error";

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

  res.status(statusCode).json({
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  });
};
