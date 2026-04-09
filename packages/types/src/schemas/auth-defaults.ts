import type { LoginFormData } from "./auth";
import type { SignupFormData } from "./auth";

export const loginDefaultValues: LoginFormData = {
  email: "",
  password: "",
};

export const signupDefaultValues: SignupFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};
