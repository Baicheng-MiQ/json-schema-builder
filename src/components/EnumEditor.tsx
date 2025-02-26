
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Plus, X } from "lucide-react";
import { SchemaProperty } from "../types/schema";

interface EnumEditorProps {
  property: SchemaProperty;
  index: number;
  enumInputValue: string;
  onPropertyUpdate: (index: number, updates: Partial<SchemaProperty>) => void;
  onEnumInputChange: (index: number, value: string) => void;
  onAddEnumValue: (index: number) => void;
  onRemoveEnumValue: (propertyIndex: number, enumIndex: number) => void;
}

export function EnumEditor({
  property,
  index,
  enumInputValue,
  onPropertyUpdate,
  onEnumInputChange,
  onAddEnumValue,
  onRemoveEnumValue,
}: EnumEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          checked={property.hasEnum}
          onCheckedChange={(checked) =>
            onPropertyUpdate(index, {
              hasEnum: checked,
              enum: checked ? [] : undefined,
            })
          }
        />
        <span className="text-sm">Enum</span>
      </div>
      {property.hasEnum && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder={`Enter enum value${property.type === "number" ? " (number only)" : ""}`}
              value={enumInputValue}
              onChange={(e) => onEnumInputChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddEnumValue(index);
                }
              }}
              type={property.type === "number" ? "number" : "text"}
            />
            <Button
              onClick={() => onAddEnumValue(index)}
              size="sm"
              className="flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {property.enum?.map((enumValue, enumIndex) => (
              <div
                key={enumIndex}
                className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
              >
                {enumValue}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => onRemoveEnumValue(index, enumIndex)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
