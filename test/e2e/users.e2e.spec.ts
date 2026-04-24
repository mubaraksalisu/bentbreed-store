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
    });
  });
});
