import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { ProtectedRoute } from "@/app/router/protected-route.tsx";

const LoginPage = lazy(() => import("@/features/auth/pages/login"));
const SignupPage = lazy(() => import("@/features/auth/pages/signup"));
const FicheEtablissementCreatePage = lazy(
  () => import("@/features/etablissement/pages/fiche-etablissement-create"),
);
const FicheEtablissementEditPage = lazy(
  () => import("@/features/etablissement/pages/fiche-etablissement-edit"),
);

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div />} />
          <Route
            path="/etablissements/nouveau"
            element={<FicheEtablissementCreatePage />}
          />
          <Route
            path="/etablissements/:siret"
            element={<FicheEtablissementEditPage />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
