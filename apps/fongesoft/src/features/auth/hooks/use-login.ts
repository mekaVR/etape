import { useMutation } from "@etape/api-client/hooks";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import type { ApiError } from "@etape/api-client/types";
import { useAuth } from "@/app/providers/auth-provider";

export function useLogin() {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      setUserFromToken(data.accessToken);
      navigate("/");
    },
    onError: (error: AxiosError<ApiError>) => error?.response?.data?.message,
  });
}
