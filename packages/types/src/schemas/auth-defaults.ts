import type { LoginPayload } from "./auth";
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
