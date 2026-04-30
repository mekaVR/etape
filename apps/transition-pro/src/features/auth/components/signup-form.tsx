import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { useRegister } from "../hooks/use-register";
import {
  signupFormSchema,
  type SignupFormData,
} from "@etape/types/schemas/auth";
import { signupDefaultValues } from "@etape/types/schemas/auth-defaults";
import logo from "@/assets/transition-pro_logo.png";
import cover from "@/assets/HERO_3.png";
import { Link } from "react-router";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: signupDefaultValues,
  });
  const { mutate, isPending } = useRegister(setError);

  return (
    <div className={cn("grid gap-6 md:grid-cols-2")}>
      <Card className="overflow-hidden min-h-[640px] md:min-h-[700px]">
        <CardContent className="p-6 md:p-8">
          <form
            onSubmit={handleSubmit(({ confirmPassword, ...data }) =>
              mutate(data),
            )}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img src={logo} alt="Transition Pro" className="h-40 w-auto" />
                <h1 className="text-2xl font-bold">Créer un compte</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Remplissez les informations ci-dessous
                </p>
              </div>
              {errors.root?.serverError && (
                <FieldError role="alert" className="text-sm text-destructive">
                  {errors.root.serverError.message}
                </FieldError>
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
              <Field data-invalid={!!errors.acceptCgu}>
                <div className="flex items-start gap-3">
                  <Controller
                    name="acceptCgu"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="acceptCgu"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={!!errors.acceptCgu}
                        aria-describedby={
                          errors.acceptCgu ? "accept-cgu-error" : undefined
                        }
                        className="mt-1"
                      />
                    )}
                  />
                  <label
                    htmlFor="acceptCgu"
                    className="text-sm font-normal leading-relaxed cursor-pointer"
                  >
                    J&apos;accepte les{" "}
                    <a
                      href="#"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary underline underline-offset-4 hover:opacity-80"
                    >
                      Conditions Générales d&apos;Utilisation
                    </a>{" "}
                    et les{" "}
                    <a
                      href="#"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary underline underline-offset-4 hover:opacity-80"
                    >
                      Conditions Générales d&apos;Intervention
                    </a>
                    . Je comprends que les informations de mon compte seront
                    utilisées conformément à la{" "}
                    <a
                      href="#"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary underline underline-offset-4 hover:opacity-80"
                    >
                      Politique de confidentialité et de protection des données
                      à caractère personnel
                    </a>{" "}
                    de Transitions Pro.
                  </label>
                </div>
                {errors.acceptCgu && (
                  <FieldError id="accept-cgu-error">
                    {errors.acceptCgu.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Création..." : "Créer un compte"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Déjà un compte ?{" "}
                <Link to="/login" viewTransition>
                  Se connecter
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
