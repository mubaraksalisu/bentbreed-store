import { Schema } from "joi";
import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/bad-request.error";

export const validateReqParams =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details[0].message.replace(/["]/g, "");
      return next(new BadRequestError(message));
    }

    req.params = value;
    next();
  };
