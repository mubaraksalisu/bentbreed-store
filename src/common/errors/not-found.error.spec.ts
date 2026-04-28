import NotFoundError from "./not-found.error";
import HttpError from "./http.error";

describe("NotFoundError", () => {
  it("should have default message and status code", () => {
    const error = new NotFoundError();

    expect(error.message).toBe("Not Found");
    expect(error.statusCode).toBe(404);
  });

  it("should accept a custom message", () => {
    const error = new NotFoundError("User not found");

    expect(error.message).toBe("User not found");
    expect(error.statusCode).toBe(404);
  });

  it("should be instance of HttpError", () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(HttpError);
  });

  it("should be instance of Error", () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(Error);
  });
});
