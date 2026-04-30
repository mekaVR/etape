import { Button } from "@workspace/ui/components/button";
import { useResendVerification } from "../hooks/use-resend-verification";

interface Props {
  message: string;
  email: string;
}

export function EmailNotVerifiedAlert({ message, email }: Props) {
  const { mutate, isPending, isSuccess } = useResendVerification();

  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm"
    >
      <p className="text-destructive">{message}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending || isSuccess || !email}
        onClick={() => mutate({ email })}
      >
        {isPending
          ? "Envoi..."
          : isSuccess
            ? "Email renvoyé"
            : "Renvoyer le mail de confirmation"}
      </Button>
    </div>
  );
}
