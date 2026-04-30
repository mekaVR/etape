import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/app/provider/auth-provider.tsx";

export function GuestRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
