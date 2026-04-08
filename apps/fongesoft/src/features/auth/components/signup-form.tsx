import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { useRegister } from "../hooks/use-register";
import { signupSchema, type SignupFormData } from "../schemas/signup.schema";
import { signupDefaultValues } from "@/features/auth/constants.ts";

export function SignupForm() {
  const { mutate, isPending, error: serverError } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: signupDefaultValues,
  });

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={handleSubmit(({ ...data }) => mutate(data))}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Créer un compte</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Remplissez les informations ci-dessous
                </p>
              </div>
              {serverError && (
                <FieldError role="alert">{serverError.message}</FieldError>
              )}
              <Field data-invalid={!!errors.username}>
                <FieldLabel htmlFor="username">
                  Nom d&#39;utilisateur
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  aria-invalid={!!errors.username}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                  {...register("username")}
                />
                {errors.username && (
                  <FieldError id="username-error">
                    {errors.username.message}
                  </FieldError>
                )}
              </Field>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <FieldError id="email-error">
                    {errors.email.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      {...register("password")}
                    />
                    {errors.password && (
                      <FieldError id="password-error">
                        {errors.password.message}
                      </FieldError>
                    )}
                  </Field>
                  <Field data-invalid={!!errors.confirmPassword}>
                    <FieldLabel htmlFor="confirmPassword">Confirmer</FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirm-password-error"
                          : undefined
                      }
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <FieldError id="confirm-password-error">
                        {errors.confirmPassword.message}
                      </FieldError>
                    )}
                  </Field>
                </Field>
                <FieldDescription>
                  Minimum 8 caractères, au moins une lettre et un chiffre.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Création..." : "Créer un compte"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Déjà un compte ? <a href="/login">Se connecter</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
