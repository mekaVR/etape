import { CircleAlertIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";

interface AlertInfoProps {
  alertTitle: string;
  alertDescription: string;
}

export function AlertInfo({ alertTitle, alertDescription }: AlertInfoProps) {
  return (
    <Alert className="border-none bg-sidebar-accent text-sidebar-active-indicator">
      <CircleAlertIcon />
      <AlertTitle>{alertTitle}</AlertTitle>
      <AlertDescription className="text-sidebar-active-indicator/80">
        {alertDescription}
      </AlertDescription>
    </Alert>
  );
}
