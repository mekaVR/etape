import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router";
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
import { useResetPassword } from "../hooks/use-reset-password";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from "@etape/types/schemas/auth";
import { resetPasswordDefaultValues } from "@etape/types/schemas/auth-defaults";
import logo from "@/assets/transition-pro_logo.png";
import cover from "@/assets/woman_1.png";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { ...resetPasswordDefaultValues, token },
  });
  const { mutate, isPending } = useResetPassword(setError);

  if (!token) {
    return (
      <div className={cn("grid gap-6 md:grid-cols-2")}>
        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img src={logo} alt="Transition Pro" className="h-40 w-auto" />
                <h1 className="text-2xl font-bold">Lien invalide</h1>
                <p className="text-balance text-muted-foreground">
                  Le lien de réinitialisation est manquant ou incorrect.
                </p>
              </div>
              <FieldDescription className="text-center">
                <Link to="/forgot-password">Demander un nouveau lien</Link>
              </FieldDescription>
            </FieldGroup>
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

  return (
    <div className={cn("grid gap-6 md:grid-cols-2")}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form
            onSubmit={handleSubmit(({ confirmPassword, ...data }) =>
              mutate(data),
            )}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img src={logo} alt="Transition Pro" className="h-40 w-auto" />
                <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
                <p className="text-balance text-muted-foreground">
                  Choisissez un nouveau mot de passe pour votre compte.
                </p>
              </div>
              {errors.root?.serverError && (
                <FieldError role="alert" className="text-sm text-destructive">
                  {errors.root.serverError.message}
                </FieldError>
              )}
              <input type="hidden" {...register("token")} />
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
                  {isPending ? "Modification..." : "Modifier le mot de passe"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                <Link to="/login">Retour à la connexion</Link>
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
