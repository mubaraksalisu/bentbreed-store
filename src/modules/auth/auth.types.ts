export interface LoginUserResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDto {
  userId: string;
  hashedToken: string;
  expiresAt: Date;
}
