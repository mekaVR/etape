import { Routes, Route } from "react-router";
import { ProtectedRoute } from "@/app/router/protected-route.tsx";
import LoginPage from "@/features/auth/pages/login.tsx";
import SignupPage from "@/features/auth/pages/signup.tsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<div />} />
      </Route>
    </Routes>
  );
}
