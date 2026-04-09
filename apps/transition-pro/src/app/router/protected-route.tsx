import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/app/provider/auth-provider.tsx";
import type { User } from "@etape/types/types/auth";

export function ProtectedRoute({ roles }: { roles?: User["role"][] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role))
    return <Navigate to="/403" replace />;

  return <Outlet />;
}
