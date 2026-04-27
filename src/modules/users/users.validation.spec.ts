import {
  expectInvalid,
  expectValid,
} from "../../common/utils/test-validation.util";
import {
  idParamSchema,
  registerSchema,
  updateSchema,
} from "./users.validation";

describe("Users Validation", () => {
  const userData = {
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "1234567890",
    email: "john.doe@example.com",
    password: "password123",
  };

  describe("Register Schema", () => {
    it("should accept valid user data", () => {
      expectValid(registerSchema, userData);
    });

    it("should reject missing required fields", () => {
      const { firstName, ...invalidData } = userData;
      expectInvalid(registerSchema, invalidData, "firstName");
    });

    it("should reject invalid email format", () => {
      const invalidData = { ...userData, email: "invalid-email" };
      expectInvalid(registerSchema, invalidData, "email");
    });

    it("should reject short password", () => {
      const invalidData = { ...userData, password: "123" };
      expectInvalid(registerSchema, invalidData, "password");
    });

    it("should reject long first name", () => {
      const invalidData = { ...userData, firstName: "A".repeat(101) };
      expectInvalid(registerSchema, invalidData, "firstName");
    });

    it("Should reject phone number if not string", () => {
      const invalidData = { ...userData, phoneNumber: 1234567890 };
      expectInvalid(registerSchema, invalidData, "phoneNumber");
    });

    it("Should trim whitespace from string fields", () => {
      const dataWithWhitespace = {
        ...userData,
        firstName: "  John  ",
        lastName: "  Doe  ",
        phoneNumber: "  1234567890  ",
      };
      const { error, value } = registerSchema.validate(dataWithWhitespace);
      expect(error).toBeUndefined();
      expect(value.firstName).toBe("John");
      expect(value.lastName).toBe("Doe");
      expect(value.phoneNumber).toBe("1234567890");
    });
  });

  describe("Update Schema", () => {
    it("should accept valid partial user data", () => {
      const partialData = { email: "john.new@example.com" };
      expectValid(updateSchema, partialData);
    });

    it("should reject empty payload", () => {
      expectInvalid(
        updateSchema,
        {},
        "[firstName, lastName, phoneNumber, email, password]",
      );
    });
  });

  describe("ID Param Schema", () => {
    it("should accept valid UUID", () => {
      expectValid(idParamSchema, {
        id: "550e8400-e29b-41d4-a716-446655440000",
      });
    });

    it("should reject invalid UUID", () => {
      expectInvalid(idParamSchema, { id: "invalid-uuid" }, "id");
    });

    it("should reject missing ID", () => {
      expectInvalid(idParamSchema, {}, "id");
    });
  });
});
