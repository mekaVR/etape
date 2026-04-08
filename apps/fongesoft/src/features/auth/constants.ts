import type { LoginFormData } from "./schemas/login.schema";
import type { SignupFormData } from "./schemas/signup.schema";

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
