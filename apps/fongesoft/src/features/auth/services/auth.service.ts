import { apiClient, setAccessToken } from "@etape/api-client/client";
import type {
  LoginPayload,
  AuthResponse,
  RegisterPayload,
} from "@/features/auth/interfaces/auth.interfaces.ts";

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
