import HttpError from "./http.error";

describe("HttpError", () => {
  it("should set message and statusCode correctly", () => {
    const error = new HttpError(400, "Bad Request");

    expect(error.message).toBe("Bad Request");
    expect(error.statusCode).toBe(400);
  });

  it("should set isOperational to true by default", () => {
    const error = new HttpError(500, "Server Error");

    expect(error.isOperational).toBe(true);
  });

  it("should be instance of Error", () => {
    const error = new HttpError(404, "Not Found");

    expect(error).toBeInstanceOf(Error);
  });

  it("should have a stack trace", () => {
    const error = new HttpError(500, "Error");

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
  });
});
