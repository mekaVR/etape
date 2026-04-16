export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: "beneficiaire" | "agent" | "admin";
}
