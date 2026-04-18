import { User } from "../../generated/prisma/client";
import UserRepository from "./users.repository";
import { CreateUserDto } from "./users.types";
import * as bcrypt from "bcrypt";
import BadRequestError from "../../common/errors/bad-request.error";
import NotFoundError from "../../common/errors/not-found.error";

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

  async findById(
    id: string,
  ): Promise<Omit<User, "password" | "isEmailVerified"> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("No user found with the provided id");

    const { password, isEmailVerified, ...foundUser } = user;
    return foundUser;
  }

  async update(id: string, data: Partial<CreateUserDto>) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("No user found with the provided id");

    if (data.email) {
      const emailExists = await this.userRepository.findByEmail(data.email);
      if (emailExists && emailExists.id !== id)
        throw new BadRequestError("User with this email already exists");
    }

    if (data.phoneNumber) {
      const phoneExists = await this.userRepository.findByPhoneNumber(
        data.phoneNumber,
      );
      if (phoneExists && phoneExists.id !== id)
        throw new BadRequestError("User with this phone number already exists");
    }

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await this.userRepository.update(id, data);
    const { password, isEmailVerified, ...result } = updatedUser;
    return result;
  }

  async remove(id: string) {
    let user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("No user found with the provided id");

    await this.userRepository.remove(id);
  }
}
