import { Response } from "express";
import { ApiResponse } from "../utils/api-response";

export default class BaseController {
  protected ok(
    res: Response,
    data: any,
    message = "Success",
    status = 200,
    meta?: any,
  ) {
    return ApiResponse.success(res, data, message, status, meta);
  }

  protected created(res: Response, data: any, message = "Resource created") {
    return ApiResponse.success(res, data, message, 201);
  }
}
