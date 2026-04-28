import type {
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordFormData,
} from "./auth";
import type { SignupFormData } from "./auth";

export const loginDefaultValues: LoginPayload = {
  email: "",
  password: "",
};

export const signupDefaultValues: SignupFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const forgotPasswordDefaultValues: ForgotPasswordPayload = {
  email: "",
};

export const resetPasswordDefaultValues: Omit<ResetPasswordFormData, "token"> =
  {
    password: "",
    confirmPassword: "",
  };
