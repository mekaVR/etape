import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./protected-route";
import Layout from "../layouts/layout";
import LoginPage from "@/features/auth/pages/login";
import SignupPage from "@/features/auth/pages/signup.tsx";
import ForgotPasswordPage from "@/features/auth/pages/forgot-password.tsx";
import ResetPasswordPage from "@/features/auth/pages/reset-password.tsx";
import Dashboard from "@/features/dashboard/pages/dashboard.tsx";
import Profile from "@/features/profile/pages/profile.tsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/messagerie" element={<div>MESSAGERIE</div>} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/dossiers" element={<div>dossiers</div>} />
          <Route path="/documents" element={<div>documents</div>} />
          <Route path="/rendez-vous" element={<div>rendez-vous</div>} />
          <Route path="/cpi" element={<div>cpi</div>} />
          <Route path="/reseau" element={<div>reseau</div>} />
        </Route>
      </Route>
    </Routes>
  );
}
