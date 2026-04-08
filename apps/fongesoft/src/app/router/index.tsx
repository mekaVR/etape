import LoginPage from "@/features/auth/pages/login";
import { Routes, Route } from "react-router";
import SignupPage from "@/features/auth/pages/signup.tsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<div>HELLO WORLD</div>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}
