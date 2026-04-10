import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./protected-route";

const LoginPage = lazy(() => import("@/features/auth/pages/login"));
const SignupPage = lazy(() => import("@/features/auth/pages/signup"));

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
