import UsersService from "./users.service";

describe("UsersService", () => {
  let usersService: UsersService;
  let userRepository: any;

  const userData = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phoneNumber: "1234567890",
    password: "password123",
  };

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findByPhoneNumber: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    usersService = new UsersService(userRepository);
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const { password, ...rest } = userData;
      const createUserResponse = {
        id: "user-id",
        ...userData,
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByPhoneNumber.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(createUserResponse);
      const result = await usersService.create(userData);
      expect(result).toEqual({ id: "user-id", ...rest });
    });

    it("should throw an error if email already exists", async () => {
      userRepository.findByEmail.mockResolvedValue(userData);
      await expect(usersService.create(userData)).rejects.toThrow(
        "User with this email already exists",
      );
    });

    it("should throw an error if phone number already exists", async () => {
      userRepository.findByPhoneNumber.mockResolvedValue(userData);
      await expect(usersService.create(userData)).rejects.toThrow(
        "User with this phone number already exists",
      );
    });
  });

  describe("findById", () => {
    it("should return user by id", async () => {
      const { password, ...rest } = userData;
      const findByIdResponse = {
        id: "user-id",
        ...userData,
      };
      userRepository.findById.mockResolvedValue(findByIdResponse);
      const result = await usersService.findById("user-id");
      expect(result).toEqual({ id: "user-id", ...rest });
    });

    it("should throw an error if user not found", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(usersService.findById("non-existent-id")).rejects.toThrow(
        "No user found with the provided id",
      );
    });
  });

  describe("find", () => {
    it("should return all users", async () => {
      const { password, ...rest } = userData;
      const findResponse = [
        {
          id: "user-id",
          ...userData,
        },
      ];
      userRepository.find.mockResolvedValue({ data: findResponse, total: 1 });
      const result = await usersService.find({ page: 1, limit: 10 });
      expect(result.users).toEqual([{ id: "user-id", ...rest }]);
      expect(result.meta).toEqual({
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe("update", () => {
    it("should update user data", async () => {
      const updatedData = {
        firstName: "Updated",
        email: "updated@example.com",
      };

      const { password, ...rest } = userData;
      const updatedUserResponse = {
        id: "user-id",
        ...userData,
        ...updatedData,
      };

      userRepository.findById.mockResolvedValue({ ...userData, id: "user-id" });
      userRepository.update.mockResolvedValue(updatedUserResponse);
      const result = await usersService.update("user-id", updatedData);
      expect(result).toEqual({ id: "user-id", ...rest, ...updatedData });
      expect(userRepository.findById).toHaveBeenCalledWith("user-id");
    });

    it("should throw an error if user not found", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(
        usersService.update("non-existent-id", { firstName: "Updated" }),
      ).rejects.toThrow("No user found with the provided id");
    });

    it("should throw an error if email already exists", async () => {
      userRepository.findById.mockResolvedValue({ ...userData, id: "user-id" });
      userRepository.findByEmail.mockResolvedValue({
        ...userData,
        id: "another-user-id",
      });
      await expect(
        usersService.update("user-id", { email: "existing@example.com" }),
      ).rejects.toThrow("User with this email already exists");
    });

    it("should throw an error if phone number already exists", async () => {
      userRepository.findById.mockResolvedValue({ ...userData, id: "user-id" });
      userRepository.findByPhoneNumber.mockResolvedValue({
        ...userData,
        id: "another-user-id",
      });
      await expect(
        usersService.update("user-id", { phoneNumber: "0987654321" }),
      ).rejects.toThrow("User with this phone number already exists");
    });
  });

  describe("remove", () => {
    it("should remove user", async () => {
      userRepository.findById.mockResolvedValue({ ...userData, id: "user-id" });
      await usersService.remove("user-id");
      expect(userRepository.remove).toHaveBeenCalledWith("user-id");
    });

    it("should throw an error if user not found", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(usersService.remove("non-existent-id")).rejects.toThrow(
        "No user found with the provided id",
      );
    });
  });
});
