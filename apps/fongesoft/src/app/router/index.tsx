import LoginPage from "@/features/auth/pages/login";
import { BrowserRouter, Routes, Route } from "react-router";
import SignupPage from "@/features/auth/pages/signup.tsx";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
