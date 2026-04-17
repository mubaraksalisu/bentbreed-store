import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import BadRequestError from "../errors/bad-request.error";

export const validate =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details[0].message.replace(/["]/g, "");
      return next(new BadRequestError(message));
    }

    req.body = value;
    next();
  };
