import { validateReqBody } from "./validate-req-body.middleware";

describe("Validate Request Body Middleware", () => {
  it("should validate request body against schema and pass valid data to next middleware", () => {
    const req = {
      body: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    } as any;
    const res = {} as any;
    const next = jest.fn();

    const schema = {
      validate: jest.fn().mockReturnValue({ value: req.body }),
    } as any;

    const middleware = validateReqBody(schema);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    expect(req.body).toEqual({
      name: "John Doe",
      email: "john.doe@example.com",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should return BadRequestError if validation fails", () => {
    const req = {
      body: {
        name: "John Doe",
        email: "invalid-email",
      },
    } as any;
    const res = {} as any;
    const next = jest.fn();

    const schema = {
      validate: jest.fn().mockReturnValue({
        error: { details: [{ message: '"email" must be a valid email' }] },
      }),
    } as any;

    const middleware = validateReqBody(schema);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "email must be a valid email",
      }),
    );
  });
});
