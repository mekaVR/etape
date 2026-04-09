import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./protected-route";
import LoginPage from "@/features/auth/pages/login";
import SignupPage from "@/features/auth/pages/signup";

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
