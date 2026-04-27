import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/infrastructure/database/prisma";
import { randomUUID } from "node:crypto";

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
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("firstName", userData.firstName);
      expect(res.body.data).toHaveProperty("lastName", userData.lastName);
      expect(res.body.data).toHaveProperty("email", userData.email);
      expect(res.body.data).toHaveProperty("phoneNumber", userData.phoneNumber);
      expect(res.body.data).not.toHaveProperty("password");
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

  describe("GET /:id", () => {
    it("should retrieve a user by ID", async () => {
      const createRes = await request(app)
        .post("/api/users/register")
        .send(userData);
      const userId = createRes.body.data.id;

      const res = await request(app).get(`/api/users/${userId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("id", userId);
      expect(res.body.data).toHaveProperty("firstName", userData.firstName);
      expect(res.body.data).toHaveProperty("lastName", userData.lastName);
      expect(res.body.data).toHaveProperty("email", userData.email);
      expect(res.body.data).toHaveProperty("phoneNumber", userData.phoneNumber);
      expect(res.body.data).not.toHaveProperty("password");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app).get(`/api/users/${randomUUID()}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("No user found with the provided id");
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app).get(`/api/users/invalid-id`);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe("GET /", () => {
    it("should retrieve all users", async () => {
      const createRes = await request(app)
        .post("/api/users/register")
        .send(userData);
      const userId = createRes.body.data.id;

      const res = await request(app).get("/api/users");

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toEqual(1);
      expect(res.body.data[0]).toHaveProperty("id", userId);
      expect(res.body.data[0]).toHaveProperty("firstName", userData.firstName);
      expect(res.body.data[0]).toHaveProperty("lastName", userData.lastName);
      expect(res.body.data[0]).toHaveProperty("email", userData.email);
      expect(res.body.data[0]).toHaveProperty(
        "phoneNumber",
        userData.phoneNumber,
      );
      expect(res.body.data[0]).not.toHaveProperty("password");
      expect(res.body.meta).toHaveProperty("limit", 10);
      expect(res.body.meta).toHaveProperty("page", 1);
      expect(res.body.meta).toHaveProperty("total", 1);
      expect(res.body.meta).toHaveProperty("totalPages", 1);
    });
  });
});
