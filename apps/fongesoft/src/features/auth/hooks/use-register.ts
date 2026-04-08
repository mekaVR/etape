import { useMutation } from "@etape/api-client/hooks";
import { register } from "../services/auth.service";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import type { ApiError } from "@etape/api-client/types";
import { useAuth } from "@/app/providers/auth-provider";

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
