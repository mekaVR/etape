import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { useForgotPassword } from "../hooks/use-forgot-password";
import {
  forgotPasswordSchema,
  type ForgotPasswordPayload,
} from "@etape/types/schemas/auth";
import { forgotPasswordDefaultValues } from "@etape/types/schemas/auth-defaults";
import logo from "@/assets/transition-pro_logo.png";
import cover from "@/assets/HERO_2.png";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
  });
  const { mutate, isPending, isSuccess } = useForgotPassword(setError);

  return (
    <div className={cn("grid items-center gap-6 md:grid-cols-[2fr_1fr]")}>
      <div className="overflow-hidden min-h-[640px] md:min-h-[700px]">
        <div className="p-6 md:p-8">
          {isSuccess ? (
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img src={logo} alt="Transition Pro" className="h-40 w-auto" />
                <h1 className="text-2xl font-bold">
                  Vérifiez votre boîte mail
                </h1>
                <p className="text-balance text-muted-foreground">
                  Si un compte est associé à cette adresse, vous recevrez un
                  lien de réinitialisation. Le lien est valable 1 heure.
                </p>
              </div>
              <FieldDescription className="text-center">
                <Link to="/login" viewTransition>
                  Retour à la connexion
                </Link>
              </FieldDescription>
            </FieldGroup>
          ) : (
            <form onSubmit={handleSubmit((data) => mutate(data))}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <img
                    src={logo}
                    alt="Transition Pro"
                    className="h-40 w-auto"
                  />
                  <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
                  <p className="text-balance text-muted-foreground">
                    Entrez votre email, nous vous enverrons un lien de
                    réinitialisation.
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
                    placeholder="exemple@email.com"
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
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Envoi..." : "Envoyer le lien"}
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  <Link to="/login">Retour à la connexion</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}
        </div>
      </div>
      <Card className="hidden overflow-hidden p-0 md:block md:h-[700px]">
        <img
          src={cover}
          alt="Transition Pro"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </Card>
    </div>
  );
}
