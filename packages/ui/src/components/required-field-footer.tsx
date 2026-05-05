import { FieldError, FieldDescription } from "@workspace/ui/components/field";

interface RequiredFieldFooterProps {
  errorMessage?: string;
  description?: string;
}

export function RequiredFieldFooter({
  errorMessage,
  description = "Ce champ est requis",
}: RequiredFieldFooterProps) {
  return errorMessage ? (
    <FieldError>{errorMessage}</FieldError>
  ) : (
    <FieldDescription>{description}</FieldDescription>
  );
}
