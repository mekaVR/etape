import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";

import { professionalFormDefaultValues } from "@etape/types/schemas/profile-defaults";
import { useMyProfile } from "../hooks/use-my-profile";
import { useUpdateMyProfile } from "../hooks/use-update-my-profile";
import { DatePicker } from "@workspace/ui/components/date-picker";
import {
  type ProfessionalFormData,
  professionalFormSchema,
} from "@etape/types/schemas/beneficiaire-profile";
import { mapProfessionalToForm } from "@/lib/profile-mappers.ts";

export function ProfessionalSection() {
  const { data: profile } = useMyProfile();

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: professionalFormDefaultValues,
    values: profile ? mapProfessionalToForm(profile) : undefined,
  });

  const { mutate, isPending } = useUpdateMyProfile(setError);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ma situation professionnelle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <FieldGroup>
            <Field data-invalid={!!errors.datePremierEmploi}>
              <FieldLabel htmlFor="datePremierEmploi">
                Date du premier emploi
              </FieldLabel>
              <Controller
                name="datePremierEmploi"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="datePremierEmploi"
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={!!errors.datePremierEmploi}
                  />
                )}
              />
              {errors.datePremierEmploi && (
                <FieldError>{errors.datePremierEmploi.message}</FieldError>
              )}
            </Field>

            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
