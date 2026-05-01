import * as bcrypt from "bcrypt";
import UnauthorizedError from "../../common/errors/unauthorized.error";
import UsersService from "../users/users.service";
import { LoginUserResponseDto } from "./auth.types";
import { JwtService } from "../../common/auth/jwt.service";
import AuthRepository from "./auth.repository";
import { CreateUserDto } from "../users/users.types";

export default class AuthService {
  constructor(
    private usersService: UsersService,
    private authRepository: AuthRepository,
  ) {}

  async registerUser(data: CreateUserDto) {
    const newUser = await this.usersService.create(data);

    const { accessToken, refreshToken } = await this.generateTokens(newUser);
    return { accessToken, refreshToken, user: newUser };
  }

  async loginUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError("Invalid email or password");

    return this.generateTokens(user);
  }

  private async generateTokens(user: any): Promise<LoginUserResponseDto> {
    const payload = { id: user.id, role: user.role };

    const accessToken = JwtService.signAccessToken(payload);
    const refreshToken = JwtService.signRefreshToken(payload);

    await this.saveRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(refreshToken: string, userId: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(refreshToken, salt);

    await this.authRepository.create({
      userId,
      hashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  }

  private async getMatchedToken(refreshToken: string) {
    let payload: any;

    try {
      payload = JwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const tokens = await this.authRepository.getUserTokens(payload.id);

    for (const token of tokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.hashedToken);

      if (isMatch) {
        return {
          token,
          payload,
        };
      }
    }

    return {
      token: null,
      payload,
    };
  }

  async refreshTokens(refreshToken: string) {
    const { token: matchedToken, payload } =
      await this.getMatchedToken(refreshToken);

    // reuse detection
    if (!matchedToken) {
      await this.authRepository.deleteAllUserTokens(payload.id);

      throw new UnauthorizedError("Refresh token reuse detected");
    }

    if (matchedToken.expiresAt < new Date()) {
      await this.authRepository.delete(matchedToken.id);

      throw new UnauthorizedError("Refresh token expired");
    }

    await this.authRepository.delete(matchedToken.id);

    let user;
    try {
      user = await this.usersService.findById(matchedToken.userId);
    } catch {
      await this.authRepository.deleteAllUserTokens(matchedToken.userId);

      throw new UnauthorizedError("Invalid refresh token");
    }

    return this.generateTokens(user);
  }

  async logout(refreshToken: string) {
    try {
      const { token: matchedToken, payload } =
        await this.getMatchedToken(refreshToken);

      if (matchedToken) {
        await this.authRepository.delete(matchedToken.id);
        return;
      }

      if (payload?.id) {
        await this.authRepository.deleteAllUserTokens(payload.id);
      }
    } catch {
      // swallow errors → logout should not fail
      return;
    }
  }
}
