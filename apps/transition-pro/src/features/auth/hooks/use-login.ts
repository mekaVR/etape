import { AxiosError } from "axios";
import { useMutation } from "@etape/api-client/hooks";
import { login } from "@etape/api-client/auth";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/provider/auth-provider.tsx";
import { applyApiError } from "@/lib/apply-api-error.ts";
import { AUTH_ERROR_CODES } from "@etape/types/constants/api-errors";
import { isApiCodedError } from "@etape/types/guards/api-error";
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
    onError: (error) => {
      if (
        error instanceof AxiosError &&
        isApiCodedError(error.response?.data)
      ) {
        const data = error.response.data;
        if (data.code === AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED) {
          setError("root.emailNotVerified", { message: data.message });
          return;
        }
      }
      applyApiError(error, setError);
    },
  });
}
