import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./protected-route";
import { GuestRoute } from "./guest-route";
import Layout from "../layouts/layout";
import LoginPage from "@/features/auth/pages/login";
import SignupPage from "@/features/auth/pages/signup.tsx";
import ForgotPasswordPage from "@/features/auth/pages/forgot-password.tsx";
import ResetPasswordPage from "@/features/auth/pages/reset-password.tsx";
import Dashboard from "@/features/dashboard/pages/dashboard.tsx";
import Profile from "@/features/profile/pages/profile.tsx";
import CheckEmailPage from "@/features/auth/pages/check-email.tsx";
import VerifyEmailPage from "@/features/auth/pages/verify-email.tsx";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>
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
