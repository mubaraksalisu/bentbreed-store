import prisma from "../../infrastructure/database/prisma";
import { RefreshTokenDto } from "./auth.types";

export default class AuthRepository {
  create(data: RefreshTokenDto) {
    return prisma.refreshToken.create({
      data,
    });
  }

  getUserTokens(userId: string) {
    return prisma.refreshToken.findMany({
      where: { userId },
    });
  }

  delete(id: string) {
    return prisma.refreshToken.delete({
      where: { id },
    });
  }

  deleteAllUserTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
