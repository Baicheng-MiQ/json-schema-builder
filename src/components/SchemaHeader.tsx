
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Copy, Plus } from "lucide-react";

interface SchemaHeaderProps {
  isStrictMode: boolean;
  onStrictModeChange: (checked: boolean) => void;
  onAddProperty: () => void;
  onCopySchema: () => void;
}

export const SchemaHeader = ({
  isStrictMode,
  onStrictModeChange,
  onAddProperty,
  onCopySchema,
}: SchemaHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Schema Builder</h2>
        <div className="flex items-center gap-2">
          <Switch
            checked={isStrictMode}
            onCheckedChange={onStrictModeChange}
          />
          <span className="text-sm">Strict Mode</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopySchema}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />

        </Button>
      </div>
      <Button onClick={onAddProperty} size="sm" className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Property
      </Button>
    </div>
  );
};
