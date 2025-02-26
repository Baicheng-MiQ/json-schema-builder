
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Plus } from "lucide-react";
import { SchemaProperty } from "../types/schema";
import { PropertyEditor } from "./PropertyEditor";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface ObjectTypeEditorProps {
  property: SchemaProperty;
  index: number;
  isStrictMode: boolean;
  enumInputValue: string;
  onPropertyUpdate: (index: number, updates: Partial<SchemaProperty>) => void;
  onEnumInputChange: (index: number, value: string) => void;
  onAddEnumValue: (index: number) => void;
  onRemoveEnumValue: (propertyIndex: number, enumIndex: number) => void;
  nestingLevel: number;
}

export function ObjectTypeEditor({
  property,
  index,
  isStrictMode,
  enumInputValue,
  onPropertyUpdate,
  onEnumInputChange,
  onAddEnumValue,
  onRemoveEnumValue,
  nestingLevel,
}: ObjectTypeEditorProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleAddNestedProperty = () => {
    const newProperties = [...(property.properties || []), {
      name: "",
      type: "string" as const,
      required: isStrictMode,
      hasEnum: false,
    }];
    onPropertyUpdate(index, { properties: newProperties });
  };

  const handleUpdateNestedProperty = (propertyIndex: number, updates: Partial<SchemaProperty>) => {
    const newProperties = [...(property.properties || [])];
    newProperties[propertyIndex] = { ...newProperties[propertyIndex], ...updates };
    onPropertyUpdate(index, { properties: newProperties });
  };

  const handleRemoveNestedProperty = (propertyIndex: number) => {
    const newProperties = property.properties?.filter((_, i) => i !== propertyIndex);
    onPropertyUpdate(index, { properties: newProperties });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[1]);
      const newIndex = parseInt(over.id.toString().split('-')[1]);
      
      const newProperties = arrayMove(property.properties || [], oldIndex, newIndex);
      onPropertyUpdate(index, { properties: newProperties });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          checked={property.additionalObjectProperties ?? false}
          onCheckedChange={(checked) =>
            onPropertyUpdate(index, { additionalObjectProperties: checked })
          }
        />
        <span className="text-sm">Allow Additional Properties</span>
      </div>
      <div className="space-y-2">
        <Button
          onClick={handleAddNestedProperty}
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Object Property
        </Button>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext 
            items={(property.properties || []).map((_, i) => `property-${i}`)} 
            strategy={verticalListSortingStrategy}
          >
            {property.properties?.map((prop, propIndex) => (
              <PropertyEditor
                key={propIndex}
                property={prop}
                index={propIndex}
                isStrictMode={isStrictMode}
                enumInputValue={enumInputValue}
                onPropertyUpdate={handleUpdateNestedProperty}
                onRemoveProperty={handleRemoveNestedProperty}
                onEnumInputChange={onEnumInputChange}
                onAddEnumValue={onAddEnumValue}
                onRemoveEnumValue={onRemoveEnumValue}
                nestingLevel={nestingLevel + 1}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
