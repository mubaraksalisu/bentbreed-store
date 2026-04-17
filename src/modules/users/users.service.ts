import { User } from "../../generated/prisma/client";
import UserRepository from "./users.repository";
import { CreateUserDto } from "./users.types";
import * as bcrypt from "bcrypt";
import BadRequestError from "../../common/errors/bad-request.error";

export default class UsersService {
  constructor(private userRepository: UserRepository) {}

  async create(
    data: CreateUserDto,
  ): Promise<Omit<User, "password" | "isEmailVerified">> {
    let user = await this.userRepository.findByEmail(data.email);
    if (user) throw new BadRequestError("User with this email already exists");

    const phone = await this.userRepository.findByPhoneNumber(data.phoneNumber);
    if (phone)
      throw new BadRequestError("User with this phone number already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    const { password, isEmailVerified, ...newUser } = user;
    return newUser;
  }
}
