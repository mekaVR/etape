import { useNavigate, useSearchParams } from "react-router";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { FieldGroup } from "@workspace/ui/components/field";
import { useVerifyEmail } from "../hooks/use-verify-email";
import logo from "@/assets/transition-pro_logo.png";
import cover from "@/assets/HERO_2.png";

export function VerifyEmailCard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { isLoading, isSuccess, isError } = useVerifyEmail(token);

  let title: string;
  let description: string;
  let buttonLabel: string | null = null;
  let buttonAction: (() => void) | null = null;

  if (!token) {
    title = "Lien invalide";
    description =
      "Ce lien de vérification est incomplet. Veuillez utiliser le lien fourni dans votre email de confirmation.";
    buttonLabel = "Retour à la connexion";
    buttonAction = () => navigate("/login");
  } else if (isLoading) {
    title = "Vérification en cours...";
    description = "Nous confirmons votre adresse email.";
  } else if (isSuccess) {
    title = "Compte activé";
    description =
      "Votre adresse email a bien été confirmée. Vous pouvez maintenant vous connecter.";
    buttonLabel = "Aller à la connexion";
    buttonAction = () => navigate("/login", { state: { verified: true } });
  } else if (isError) {
    title = "Lien invalide ou expiré";
    description =
      "Ce lien n'est plus valable. Connectez-vous pour demander un nouveau mail de confirmation.";
    buttonLabel = "Retour à la connexion";
    buttonAction = () => navigate("/login");
  } else {
    title = "";
    description = "";
  }

  return (
    <div className={cn("grid items-center gap-6 md:grid-cols-[2fr_1fr]")}>
      <div className="overflow-hidden min-h-[640px] md:min-h-[700px]">
        <div className="p-6 md:p-8">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <img src={logo} alt="Transition Pro" className="h-40 w-auto" />
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-balance text-muted-foreground">
                {description}
              </p>
            </div>
            {buttonLabel && buttonAction && (
              <Button type="button" onClick={buttonAction}>
                {buttonLabel}
              </Button>
            )}
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
