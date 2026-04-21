import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./protected-route";
import Layout from "../layouts/layout";

const LoginPage = lazy(() => import("@/features/auth/pages/login"));
const SignupPage = lazy(() => import("@/features/auth/pages/signup"));
const Dashboard = lazy(() => import("@/features/dashboard/pages/dashboard"));

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
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
    </Suspense>
  );
}
