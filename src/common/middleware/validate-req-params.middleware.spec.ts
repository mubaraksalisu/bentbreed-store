import { validateReqParams } from "./validate-req-params.middleware";

describe("Validate Request params Middleware", () => {
  it("should validate request params against schema and pass valid data to next middleware", () => {
    const req = {
      params: {
        id: "123",
      },
    } as any;
    const res = {} as any;
    const next = jest.fn();

    const schema = {
      validate: jest.fn().mockReturnValue({ value: req.params }),
    } as any;

    const middleware = validateReqParams(schema);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });
    expect(req.params).toEqual({
      id: "123",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should return BadRequestError if validation fails", () => {
    const req = {
      params: {
        id: "123",
      },
    } as any;
    const res = {} as any;
    const next = jest.fn();

    const schema = {
      validate: jest.fn().mockReturnValue({
        error: { details: [{ message: '"id" must be a valid UUID' }] },
      }),
    } as any;

    const middleware = validateReqParams(schema);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "id must be a valid UUID",
      }),
    );
  });
});
