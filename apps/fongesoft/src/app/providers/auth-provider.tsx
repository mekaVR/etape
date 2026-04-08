import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  apiClient,
  setAccessToken,
  clearAccessToken,
} from "@etape/api-client/client";
import { decodeToken } from "@/features/auth/services/auth.service";
import type { User } from "@/features/auth/interfaces/user.interface";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUserFromToken: (token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .post<{ accessToken: string }>("/auth/refresh", {})
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        setUser(decodeToken(data.accessToken));
      })
      .catch(() => {
        clearAccessToken();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function setUserFromToken(token: string) {
    setUser(decodeToken(token));
  }

  async function logout() {
    await apiClient.post("/auth/logout");
    clearAccessToken();
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUserFromToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
