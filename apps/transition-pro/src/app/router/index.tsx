import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./protected-route";
import Layout from "../layouts/layout";
import LoginPage from "@/features/auth/pages/login";
import SignupPage from "@/features/auth/pages/signup.tsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<div>DASHBOARD</div>} />
          <Route path="/messagerie" element={<div>MESSAGERIE</div>} />
          <Route path="/profil" element={<div>PROFILE</div>} />
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
