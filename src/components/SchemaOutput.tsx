import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ChevronRight, Copy, AlertTriangle } from "lucide-react";
import { cn } from "../utils/utils";

interface SchemaOutputProps {
  schemaJson: string;
  onCopySchema: () => void;
  hasErrors?: boolean;
  className?: string;
}

export const SchemaOutput = ({ schemaJson, onCopySchema, hasErrors, className }: SchemaOutputProps) => {
  return (
    <Card className={cn(className, hasErrors && "opacity-50")}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          <h2 className="text-2xl font-semibold">Output</h2>
          {hasErrors && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span>Fix validation errors to enable output</span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopySchema}
          disabled={hasErrors}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Schema
        </Button>
      </div>
      <ScrollArea className="">
        <pre className={cn("text-sm bg-muted/50 p-4 rounded-lg overflow-auto text-wrap", hasErrors && "blur-[2px]")}>
          {schemaJson}
        </pre>
      </ScrollArea>
    </Card>
  );
};
