import { Item, ItemContent } from "@workspace/ui/components/item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { FolderIcon } from "@phosphor-icons/react";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <h1>Mon tableau de bord</h1>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className={"flex justify-between w-full"}>
              <h2>Mes dossier en cours</h2>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-sidebar-accent"
              >
                <Plus />
                Nouvelle demande
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="h-0.5 bg-primary my-5" />
          <Item variant={"outline"}>
            <ItemContent>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="dossier">
                  <AccordionTrigger>
                    <span className="flex-1 text-left flex items-center">
                      <FolderIcon className={"size-8 text-primary mr-5"} />
                      Avancement du dossier DD-202-152
                    </span>
                    <Badge variant="default" className={"mr-5"}>
                      En cours d'examen
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>FLOP</AccordionContent>
                </AccordionItem>
              </Accordion>
            </ItemContent>
          </Item>
        </CardContent>
      </Card>
    </div>
  );
}
