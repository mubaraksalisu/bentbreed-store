import { Schema } from "joi";

export const expectValid = (schema: Schema, payload: any) => {
  const { error } = schema.validate(payload);
  expect(error).toBeUndefined();
};

export const expectInvalid = (
  schema: Schema,
  payload: any,
  expectedMessage: string,
) => {
  const { error } = schema.validate(payload);
  expect(error).toBeDefined();
  expect(error?.details[0].message).toContain(expectedMessage);
};
