import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/infrastructure/database/prisma";

describe("/api/users", () => {
  beforeEach(async () => {
    // Clear the specific table
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    phoneNumber: "1234567890",
  };

  describe("POST /register", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/api/users/register").send(userData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("firstName", userData.firstName);
      expect(res.body).toHaveProperty("lastName", userData.lastName);
      expect(res.body).toHaveProperty("email", userData.email);
      expect(res.body).toHaveProperty("phoneNumber", userData.phoneNumber);
      expect(res.body).not.toHaveProperty("password");
    });

    it("should not create a user with existing email", async () => {
      await request(app).post("/api/users/register").send(userData);
      const res = await request(app).post("/api/users/register").send(userData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("User with this email already exists");
    });

    it("should not create a user with existing phone number", async () => {
      await request(app).post("/api/users/register").send(userData);
      const res = await request(app)
        .post("/api/users/register")
        .send({ ...userData, email: "different@example.com" });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual(
        "User with this phone number already exists",
      );
    });
  });
});
