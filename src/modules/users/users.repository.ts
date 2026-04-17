import { User } from "../../generated/prisma/client";
import prisma from "../../infrastructure/database/prisma";
import { CreateUserDto } from "./users.types";

export default class UserRepository {
  create(data: CreateUserDto) {
    return prisma.user.create({
      data,
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });
  }
}
