import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
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
import { PasswordInput } from "@workspace/ui/components/password-input";
import { useLogin } from "../hooks/use-login";
import { VerifiedBanner } from "./verified-banner";
import { EmailNotVerifiedAlert } from "./email-not-verified-alert";
import { type LoginPayload, loginSchema } from "@etape/types/schemas/auth";
import { loginDefaultValues } from "@etape/types/schemas/auth-defaults";
import logo from "@/assets/transition-pro_logo.png";
import cover from "@/assets/HERO_2.png";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });
  const { mutate, isPending } = useLogin(setError);

  const emailNotVerified = errors.root?.emailNotVerified;

  return (
    <div className={cn("grid gap-6 md:grid-cols-2")}>
      <Card className="overflow-hidden min-h-[640px] md:min-h-[700px]">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img src={logo} alt="Transition Pro" className="h-40 w-auto" />
                <h1 className="text-2xl font-bold">Bienvenue</h1>
                <p className="text-balance text-muted-foreground">
                  Connectez-vous à votre compte
                </p>
              </div>
              <VerifiedBanner />
              {emailNotVerified ? (
                <EmailNotVerifiedAlert
                  message={emailNotVerified.message ?? ""}
                  email={getValues("email")}
                />
              ) : (
                errors.root?.serverError && (
                  <FieldError role="alert" className="text-sm text-destructive">
                    {errors.root.serverError.message}
                  </FieldError>
                )
              )}
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
              <Field data-invalid={!!errors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                  <Link
                    to="/forgot-password"
                    viewTransition
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
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
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Connexion..." : "Se connecter"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Pas encore de compte ?{" "}
                <Link to="/signup" viewTransition>
                  Créer un compte
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card className="hidden overflow-hidden p-0 md:block md:max-h-[700px]">
        <img
          src={cover}
          alt="Transition Pro"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </Card>
    </div>
  );
}
