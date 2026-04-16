import { apiClient, setAccessToken } from "@etape/api-client/client";
import type { AuthResponse, User } from "@etape/types/types/auth";
import { jwtDecode } from "jwt-decode";
import type { LoginPayload, RegisterPayload } from "@etape/types/schemas/auth";

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
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  setAccessToken(data.accessToken);
  return data;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );
  setAccessToken(data.accessToken);
  return data;
}
