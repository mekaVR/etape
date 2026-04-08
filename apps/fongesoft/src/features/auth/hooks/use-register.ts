import { useMutation } from "@etape/api-client/hooks";
import { register } from "../services/auth.service";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import type { ApiError } from "@etape/api-client/types";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: () => navigate("/"),
    onError: (error: AxiosError<ApiError>) => error?.response?.data?.message,
  });
}
