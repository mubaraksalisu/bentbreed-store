import BadRequestError from "./bad-request.error";
import HttpError from "./http.error";

describe("BadRequestError", () => {
  it("should have default message and status code", () => {
    const error = new BadRequestError();

    expect(error.message).toBe("Bad Request");
    expect(error.statusCode).toBe(400);
  });

  it("should accept a custom message", () => {
    const error = new BadRequestError("Not a valid request");

    expect(error.message).toBe("Not a valid request");
    expect(error.statusCode).toBe(400);
  });

  it("should be instance of HttpError", () => {
    const error = new BadRequestError();

    expect(error).toBeInstanceOf(HttpError);
  });

  it("should be instance of Error", () => {
    const error = new BadRequestError();

    expect(error).toBeInstanceOf(Error);
  });
});
