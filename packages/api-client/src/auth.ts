import { setAccessToken } from "./client";
import type { AuthResponse, User } from "@etape/types/types/auth";
import { jwtDecode } from "jwt-decode";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@etape/types/schemas/auth";
import { getApiInstance } from "./instance.ts";

interface JwtPayload {
  sub: number;
  email: string;
  username: string;
  role: User["role"];
}

export function decodeToken(token: string): User {
  const payload = jwtDecode<JwtPayload>(token);
  return {
    id: payload.sub,
    email: payload.email,
    username: payload.username,
    role: payload.role,
  };
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await getApiInstance().post<AuthResponse>(
    "/auth/login",
    payload,
  );
  setAccessToken(data.accessToken);
  return data;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await getApiInstance().post<AuthResponse>(
    "/auth/register",
    payload,
  );
  setAccessToken(data.accessToken);
  return data;
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<void> {
  await getApiInstance().post("/auth/forgot-password", payload);
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<void> {
  await getApiInstance().post("/auth/reset-password", payload);
}
