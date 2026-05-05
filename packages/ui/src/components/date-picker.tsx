import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { Calendar } from "@workspace/ui/components/calendar";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  disabled?: boolean;
}

function formatDate(d: Date | undefined): string {
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

function parseDate(s: string): Date | undefined {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return undefined;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return undefined;
  }
  return date;
}

function applyMask(raw: string, prev: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const isDeleting = raw.length < prev.length;
  let result = digits.slice(0, 2);
  if (digits.length > 2 || (digits.length === 2 && !isDeleting)) {
    result += "/" + digits.slice(2, 4);
  }
  if (digits.length > 4 || (digits.length === 4 && !isDeleting)) {
    result += "/" + digits.slice(4, 8);
  }
  return result;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "JJ/MM/AAAA",
  id,
  disabled,
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => formatDate(value));
  const [month, setMonth] = useState<Date | undefined>(value);
  const [valueTs, setValueTs] = useState(value?.getTime());

  const currentTs = value?.getTime();
  if (currentTs !== valueTs) {
    setValueTs(currentTs);
    setText(formatDate(value));
    if (value) setMonth(value);
  }

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        inputMode="numeric"
        aria-invalid={rest["aria-invalid"]}
        aria-describedby={rest["aria-describedby"]}
        onChange={(e) => {
          const next = applyMask(e.target.value, text);
          setText(next);
          if (next === "") {
            onChange?.(undefined);
            return;
          }
          const parsed = parseDate(next);
          if (parsed) {
            setMonth(parsed);
            onChange?.(parsed);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              aria-label="Sélectionner une date"
              disabled={disabled}
              className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/80"
            >
              <CalendarIcon />
              <span className="sr-only">Sélectionner une date</span>
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value}
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                onChange?.(date);
                setText(formatDate(date));
                setOpen(false);
              }}
              captionLayout="dropdown"
              startMonth={new Date(1900, 0)}
              endMonth={new Date()}
              defaultMonth={value}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
