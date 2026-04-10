import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./protected-route";
import { useAuth } from "@/app/provider/auth-provider.tsx";

const LoginPage = lazy(() => import("@/features/auth/pages/login"));
const SignupPage = lazy(() => import("@/features/auth/pages/signup"));

function HomePage() {
  const { user, logout } = useAuth();

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
  }

  return (
    <div>
      <p>
        Connecté en tant que {user?.username} ({user?.role})
      </p>
      <button onClick={logout}>Se déconnecter</button>
      <button onClick={toggleDark}>Toggle dark mode</button>
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
