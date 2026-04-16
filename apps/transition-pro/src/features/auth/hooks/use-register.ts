import { useMutation } from "@etape/api-client/hooks";
import { register } from "@etape/api-client/auth";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/provider/auth-provider.tsx";
import { applyApiError } from "@/lib/apply-api-error.ts";
import type { UseFormSetError } from "react-hook-form";
import type { SignupFormData } from "@etape/types/schemas/auth";

export function useRegister(setError: UseFormSetError<SignupFormData>) {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: (data) => {
      setUserFromToken(data.accessToken);
      navigate("/");
    },
    onError: (error) => applyApiError(error, setError),
  });
}
