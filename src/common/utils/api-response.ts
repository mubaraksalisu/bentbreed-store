import { Response } from "express";

export const ApiResponse = {
  success: <T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200,
    meta?: any,
  ) => {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
      ...(meta && { meta }),
    });
  },

  error: (
    res: Response,
    message = "Internal server error",
    statusCode = 500,
    errors?: any,
  ) => {
    return res.status(statusCode).json({
      status: "error",
      message,
      timestamp: new Date().toISOString(),
      ...(errors && { errors }),
    });
  },
};
