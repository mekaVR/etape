import type {
  ForgotPasswordPayload,
  LoginPayload,
  ResendVerificationPayload,
  ResetPasswordFormData,
} from "./auth";
import type { SignupFormData } from "./auth";

export const loginDefaultValues: LoginPayload = {
  email: "",
  password: "",
};

export const signupDefaultValues: SignupFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  acceptCgu: false,
};

export const resendVerificationDefaultValues: ResendVerificationPayload = {
  email: "",
};

export const forgotPasswordDefaultValues: ForgotPasswordPayload = {
  email: "",
};

export const resetPasswordDefaultValues: Omit<ResetPasswordFormData, "token"> =
  {
    password: "",
    confirmPassword: "",
  };
