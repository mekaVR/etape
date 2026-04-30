import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export function VerifiedBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [show] = useState(() => {
    const state = location.state as { verified?: boolean } | null;
    return !!state?.verified;
  });

  useEffect(() => {
    if (show) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [show, location.pathname, navigate]);

  if (!show) return null;

  return (
    <div
      role="status"
      className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary"
    >
      Votre compte est activé. Vous pouvez maintenant vous connecter.
    </div>
  );
}
