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
import { nationalitesList } from "@etape/types/schemas/nationalites";

interface NationaliteComboboxProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function NationaliteCombobox({
  value,
  onChange,
  id,
  ...rest
}: NationaliteComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={rest["aria-invalid"]}
          aria-describedby={rest["aria-describedby"]}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
          )}
        >
          {value ?? "Sélectionner une nationalité"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Rechercher..." />
          <CommandList>
            <CommandEmpty>Aucune nationalité trouvée.</CommandEmpty>
            <CommandGroup>
              {nationalitesList.map((nat) => (
                <CommandItem
                  key={nat}
                  value={nat}
                  onSelect={() => {
                    onChange?.(nat === value ? undefined : nat);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === nat ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {nat}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
