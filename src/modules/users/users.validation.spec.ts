import { expectValid } from "../../common/utils/test-validation.util";
import { registerSchema } from "./users.validation";

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
      const { error } = registerSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('"firstName" is required');
    });

    it("should reject invalid email format", () => {
      const invalidData = { ...userData, email: "invalid-email" };
      const { error } = registerSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        '"email" must be a valid email',
      );
    });

    it("should reject short password", () => {
      const invalidData = { ...userData, password: "123" };
      const { error } = registerSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        '"password" length must be at least 6 characters long',
      );
    });

    it("should reject long first name", () => {
      const invalidData = { ...userData, firstName: "A".repeat(101) };
      const { error } = registerSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        '"firstName" length must be less than or equal to 100 characters long',
      );
    });

    it("Should reject phone number if not string", () => {
      const invalidData = { ...userData, phoneNumber: 1234567890 };
      const { error } = registerSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        '"phoneNumber" must be a string',
      );
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
});
