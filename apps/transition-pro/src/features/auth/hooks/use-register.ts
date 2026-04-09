import { useMutation } from "@etape/api-client/hooks";
import { register } from "@etape/api-client/auth";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import type { ApiError } from "@etape/api-client/types";
import { useAuth } from "@/app/provider/auth-provider.tsx";

export function useRegister() {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: (data) => {
      setUserFromToken(data.accessToken);
      navigate("/");
    },
    onError: (error: AxiosError<ApiError>) => error?.response?.data?.message,
  });
}
