import { Link, Navigate, useLocation } from "react-router";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { FieldDescription, FieldGroup } from "@workspace/ui/components/field";
import { useResendVerification } from "../hooks/use-resend-verification";
import logo from "@/assets/transition-pro_logo.png";
import cover from "@/assets/HERO_2.png";

interface CheckEmailLocationState {
  email?: string;
}

export function CheckEmailCard() {
  const location = useLocation();
  const state = location.state as CheckEmailLocationState | null;
  const email = state?.email;

  const { mutate, isPending, isSuccess } = useResendVerification();

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={cn("grid items-center gap-6 md:grid-cols-[2fr_1fr]")}>
      <div className="overflow-hidden min-h-[640px] md:min-h-[700px]">
        <div className="p-6 md:p-8">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <img src={logo} alt="Transition Pro" className="h-40 w-auto" />
              <h1 className="text-2xl font-bold">Vérifiez votre boîte mail</h1>
              <p className="text-balance text-muted-foreground">
                Un lien de confirmation a été envoyé à{" "}
                <span className="font-medium text-foreground">{email}</span>. Le
                lien est valable 96 heures.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isPending || isSuccess}
                onClick={() => mutate({ email })}
              >
                {isPending
                  ? "Envoi..."
                  : isSuccess
                    ? "Email renvoyé"
                    : "Renvoyer l'email"}
              </Button>
              {isSuccess && (
                <p className="text-sm text-muted-foreground text-center">
                  Si un compte non vérifié est associé à cette adresse, un
                  nouvel email vient d'être envoyé.
                </p>
              )}
            </div>
            <FieldDescription className="text-center">
              <Link to="/login" viewTransition>
                Retour à la connexion
              </Link>
            </FieldDescription>
          </FieldGroup>
        </div>
      </div>
      <Card className="relative hidden overflow-hidden p-0 md:block md:h-[700px]">
        <img
          src={cover}
          alt="Transition Pro"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"
        />
        <p className="absolute inset-x-0 bottom-0 p-8 text-2xl font-bold leading-tight text-white">
          Changer de métier tout simplement
        </p>
      </Card>
    </div>
  );
}
