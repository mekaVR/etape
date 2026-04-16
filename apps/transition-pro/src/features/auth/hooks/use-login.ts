import { useMutation } from "@etape/api-client/hooks";
import { login } from "@etape/api-client/auth";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/provider/auth-provider.tsx";
import { applyApiError } from "@/lib/apply-api-error.ts";
import type { UseFormSetError } from "react-hook-form";
import type { LoginPayload } from "@etape/types/schemas/auth";

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
