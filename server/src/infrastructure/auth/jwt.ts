import jwt from "jsonwebtoken";
import type { UserRole } from "@/domain/entities/User";

interface TokenPayload { sub: string; role: UserRole; email: string; }

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN ?? "15m" });
}

export function signRefreshToken(sub: string): string {
  return jwt.sign({ sub }, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}
