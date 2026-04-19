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
        ...rest,
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByPhoneNumber.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(createUserResponse);
      const result = await usersService.create(userData);
      expect(result).toEqual(createUserResponse);
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
});
