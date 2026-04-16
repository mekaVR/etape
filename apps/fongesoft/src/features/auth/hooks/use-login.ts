import { useMutation } from "@etape/api-client/hooks";
import { login } from "@etape/api-client/auth";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/providers/auth-provider";
import type { UseFormSetError } from "react-hook-form";
import type { LoginPayload } from "@etape/types/schemas/auth";
import { applyApiError } from "transition-pro/src/lib/apply-api-error.ts";

export function useLogin(setError: UseFormSetError<LoginPayload>) {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      setUserFromToken(data.accessToken);
      navigate("/");
    },
    onError: (error) => applyApiError(error, setError),
  });
}
