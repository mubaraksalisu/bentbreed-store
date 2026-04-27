import HttpError from "../errors/http.error";
import { errorHandler } from "./error.middleware";

describe("Error Middleware", () => {
  it("should handle HttpError and return appropriate response", () => {
    const req = {} as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn();

    const error = new HttpError(404, "Not Found");
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Not Found",
      timestamp: expect.any(String),
    });
  });
});
