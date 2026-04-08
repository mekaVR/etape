import LoginPage from "@/features/auth/pages/login";
import { Routes, Route } from "react-router";
import SignupPage from "@/features/auth/pages/signup.tsx";
import { ProtectedRoute } from "@/app/router/protected-route.tsx";

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
