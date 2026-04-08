import { useMutation } from "@etape/api-client/hooks";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import type { ApiError } from "@etape/api-client/types";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: () => navigate("/"),
    onError: (error: AxiosError<ApiError>) => error?.response?.data?.message,
  });
}
