import { Request, Response, NextFunction } from "express";
import logger from "./logger";

export default function httpLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("HTTP Request", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
    });
  });

  next();
}
