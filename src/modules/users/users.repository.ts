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

  update(id: string, data: Partial<CreateUserDto>) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async find(pagination: { skip: number; limit: number }) {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.user.count(),
    ]);

    return { data, total };
  }
}
