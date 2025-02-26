import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Trash2, GripVertical, AlertTriangle } from "lucide-react";
import { SchemaProperty } from "../types/schema";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EnumEditor } from "./EnumEditor";
import { ArrayTypeEditor } from "./ArrayTypeEditor";
import { ObjectTypeEditor } from "./ObjectTypeEditor";
import { ValidationError } from "../utils/schemaUtils";
import { cn } from "../utils/utils";

interface PropertyEditorProps {
  property: SchemaProperty;
  index: number;
  isStrictMode: boolean;
  enumInputValue: string;
  validationErrors?: ValidationError[];
  onPropertyUpdate: (index: number, updates: Partial<SchemaProperty>) => void;
  onRemoveProperty: (index: number) => void;
  onEnumInputChange: (index: number, value: string) => void;
  onAddEnumValue: (index: number) => void;
  onRemoveEnumValue: (propertyIndex: number, enumIndex: number) => void;
  nestingLevel?: number;
}

export function PropertyEditor({
  property,
  index,
  isStrictMode,
  enumInputValue,
  validationErrors = [],
  onPropertyUpdate,
  onRemoveProperty,
  onEnumInputChange,
  onAddEnumValue,
  onRemoveEnumValue,
  nestingLevel = 0,
}: PropertyEditorProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `property-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
  };

  const propertyErrors = validationErrors.filter(error => 
    error.path === `root[${index}]` || error.path.startsWith(`root[${index}].${property.name}`)
  );

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "p-4 border transition-all hover:shadow-md animate-slide-in",
        nestingLevel > 0 ? "ml-8" : "",
        propertyErrors.length > 0 && "border-red-500"
      )}
    >
      <div className="flex gap-4 items-start">
        <button
          className="mt-2 cursor-grab active:cursor-grabbing p-1 hover:bg-secondary rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-grow space-y-4">
          {propertyErrors.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertTriangle className="w-4 h-4" />
              <div className="space-y-1">
                {propertyErrors.map((error, i) => (
                  <p key={i}>{error.message}</p>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <Input
              placeholder="Property name"
              value={property.name}
              onChange={(e) => onPropertyUpdate(index, { name: e.target.value })}
              className="flex-grow"
            />
            <Select
              value={property.type}
              onValueChange={(value) =>
                onPropertyUpdate(index, {
                  type: value as SchemaProperty["type"],
                  items: value === "array" ? { type: "string" } : undefined,
                  properties: value === "object" ? [] : undefined,
                  additionalObjectProperties: value === "object" ? false : undefined,
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="object">Object</SelectItem>
                <SelectItem value="array">Array</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Description (optional)"
            value={property.description || ""}
            onChange={(e) => onPropertyUpdate(index, { description: e.target.value })}
          />
          {property.type === "object" && (
            <ObjectTypeEditor
              property={property}
              index={index}
              isStrictMode={isStrictMode}
              enumInputValue={enumInputValue}
              onPropertyUpdate={onPropertyUpdate}
              onEnumInputChange={onEnumInputChange}
              onAddEnumValue={onAddEnumValue}
              onRemoveEnumValue={onRemoveEnumValue}
              nestingLevel={nestingLevel}
            />
          )}
          {property.type === "array" && (
            <ArrayTypeEditor
              property={property}
              index={index}
              onPropertyUpdate={onPropertyUpdate}
            />
          )}
          {(property.type === "string" || property.type === "number") && (
            <EnumEditor
              property={property}
              index={index}
              enumInputValue={enumInputValue}
              onPropertyUpdate={onPropertyUpdate}
              onEnumInputChange={onEnumInputChange}
              onAddEnumValue={onAddEnumValue}
              onRemoveEnumValue={onRemoveEnumValue}
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={property.required}
              onCheckedChange={(checked) =>
                onPropertyUpdate(index, { required: checked })
              }
              disabled={isStrictMode}
            />
            <span className="text-sm">Required</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveProperty(index)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
