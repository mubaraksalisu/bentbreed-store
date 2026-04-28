import logger from "./logger";
import httpLogger from "./http-logger.middleware";

describe("HttpLoggerMiddleware", () => {
  it("should intercept HTTP requests and log them", () => {
    const req = {
      method: "GET",
      originalUrl: "/test",
      ip: "127.0.0.1",
    } as any;

    const res = {
      statusCode: 200,
      on: jest.fn((event, callback) => {
        if (event === "finish") {
          callback();
        }
      }),
    } as any;

    const next = jest.fn();

    const loggerInfoSpy = jest.spyOn(logger, "info");

    httpLogger(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(loggerInfoSpy).toHaveBeenCalledWith("HTTP Request", {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      status: res.statusCode,
      duration: expect.any(Number),
    });
  });
});
