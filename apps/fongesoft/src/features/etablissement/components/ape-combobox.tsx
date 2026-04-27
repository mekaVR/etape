import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import type { ApeCode } from "@etape/types/types/etablissement";

interface ApeComboboxProps {
  options: ApeCode[];
  value: string;
  onChange: (code: string) => void;
  id?: string;
  disabled?: boolean;
  invalid?: boolean;
  "aria-describedby"?: string;
}

export function ApeCombobox({
  options,
  value,
  onChange,
  id,
  disabled,
  invalid,
  ...aria
}: ApeComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.Code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          disabled={disabled}
          className="w-full justify-between font-normal"
          {...aria}
        >
          <span className={cn(!selected && "text-muted-foreground")}>
            {selected
              ? `${selected.Code} — ${selected.Libelle}`
              : "Sélectionner un code APE"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Rechercher un code APE..." />
          <CommandList>
            <CommandEmpty>Aucun code trouvé.</CommandEmpty>
            <CommandGroup>
              {options.map((ape) => (
                <CommandItem
                  key={ape.Code}
                  value={`${ape.Code} ${ape.Libelle}`}
                  onSelect={() => {
                    onChange(ape.Code === value ? "" : ape.Code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      ape.Code === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {ape.Code} — {ape.Libelle}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
