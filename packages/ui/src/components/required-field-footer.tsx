import { FieldError, FieldDescription } from "@workspace/ui/components/field";

export function RequiredFieldFooter({ error }: { error?: string }) {
  return error ? (
    <FieldError>{error}</FieldError>
  ) : (
    <FieldDescription className={"text-xs"}>
      ce champ est requis
    </FieldDescription>
  );
}
