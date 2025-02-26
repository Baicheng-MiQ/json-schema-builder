
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SchemaProperty } from "../types/schema";

interface ArrayTypeEditorProps {
  property: SchemaProperty;
  index: number;
  onPropertyUpdate: (index: number, updates: Partial<SchemaProperty>) => void;
}

export function ArrayTypeEditor({
  property,
  index,
  onPropertyUpdate,
}: ArrayTypeEditorProps) {
  return (
    <div className="flex gap-4 items-center">
      <span className="text-sm text-muted-foreground">Array items type:</span>
      <Select
        value={property.items?.type || "string"}
        onValueChange={(value: string) =>
          onPropertyUpdate(index, {
            items: { type: value as Exclude<SchemaProperty["type"], "array"> }
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Items type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="string">String</SelectItem>
          <SelectItem value="number">Number</SelectItem>
          <SelectItem value="boolean">Boolean</SelectItem>
          <SelectItem value="object">Object</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
