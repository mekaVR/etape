import { apiClient, setAccessToken } from "@etape/api-client/client";
import type {
  LoginPayload,
  AuthResponse,
  RegisterPayload,
} from "@/features/auth/interfaces/auth.interfaces.ts";
import { jwtDecode } from "jwt-decode";
import type { User } from "../interfaces/user.interface";

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
