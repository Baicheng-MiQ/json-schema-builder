import { useSchemaState } from "../utils/useSchemaState";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { PropertyEditor } from "./PropertyEditor";
import { SchemaHeader } from "./SchemaHeader";
import { SchemaOutput } from "./SchemaOutput";
import { generateSchemaJSON, validateSchema, ValidationError } from "../utils/schemaUtils";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SchemaDefinition } from "../types/schema";
import React from "react";
import { cn } from "../utils/utils";

interface SchemaBuilderProps {
  initialSchema?: SchemaDefinition;
  initialStrictMode?: boolean;
  className?: string;
  cardClassName?: string;
  maxHeight?: string;
  showOutput?: boolean;
  onSchemaChange?: (schema: string) => void;
  onStrictModeChange?: (isStrict: boolean) => void;
}

export const SchemaBuilder = ({
  initialSchema,
  initialStrictMode = true,
  className = "flex min-h-screen bg-background p-6 gap-6 animate-fade-in",
  cardClassName = "flex-1 p-6 backdrop-blur-sm bg-opacity-50 min-w-[600px]",
  maxHeight,
  showOutput = true,
  onSchemaChange,
  onStrictModeChange
}: SchemaBuilderProps = {}) => {
  const {
    schema,
    isStrictMode,
    enumInputValues,
    setEnumInputValues,
    addProperty,
    removeProperty,
    updateProperty,
    handlePropertyReorder,
    handleStrictModeChange,
  } = useSchemaState(initialSchema, initialStrictMode);

  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 3,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = schema.properties.findIndex((p, i) => `property-${i}` === active.id);
      const newIndex = schema.properties.findIndex((p, i) => `property-${i}` === over.id);
      handlePropertyReorder(oldIndex, newIndex);
    }
  };

  const handleCopySchema = () => {
    const schemaString = generateSchemaJSON(schema, isStrictMode);
    navigator.clipboard.writeText(schemaString);
  };

  // Call onSchemaChange when schema updates
  React.useEffect(() => {
    onSchemaChange?.(generateSchemaJSON(schema, isStrictMode));
  }, [schema, isStrictMode, onSchemaChange]);

  // Call onStrictModeChange when strict mode changes
  React.useEffect(() => {
    onStrictModeChange?.(isStrictMode);
  }, [isStrictMode, onStrictModeChange]);

  React.useEffect(() => {
    setValidationErrors(validateSchema(schema));
  }, [schema]);

  return (
    <div className={cn(className, !showOutput && "justify-center")}>
      <Card className={cn(cardClassName, !showOutput && "max-w-[800px]")}>
        <SchemaHeader
          isStrictMode={isStrictMode}
          onStrictModeChange={handleStrictModeChange}
          onAddProperty={addProperty}
          onCopySchema={handleCopySchema}
        />
        <ScrollArea className={maxHeight ? maxHeight : "h-[calc(100vh-200px)]"}>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={schema.properties.map((_, i) => `property-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {schema.properties.map((property, index) => (
                  <PropertyEditor
                    key={index}
                    property={property}
                    index={index}
                    isStrictMode={isStrictMode}
                    enumInputValue={enumInputValues[index] || ""}
                    validationErrors={validationErrors}
                    onPropertyUpdate={updateProperty}
                    onRemoveProperty={removeProperty}
                    onEnumInputChange={(index, value) =>
                      setEnumInputValues((prev) => ({
                        ...prev,
                        [index]: value,
                      }))
                    }
                    onAddEnumValue={(index) => {
                      const value = enumInputValues[index]?.trim();
                      if (!value) return;

                      const property = schema.properties[index];
                      const processedValue = property.type === "number" ? Number(value) : value;

                      if (property.type === "number" && isNaN(Number(processedValue))) {
                        return;
                      }

                      updateProperty(index, {
                        enum: [...(property.enum || []), processedValue],
                      });
                      setEnumInputValues((prev) => ({ ...prev, [index]: "" }));
                    }}
                    onRemoveEnumValue={(propertyIndex, enumIndex) => {
                      const property = schema.properties[propertyIndex];
                      if (!property.enum) return;
                      updateProperty(propertyIndex, {
                        enum: property.enum.filter((_, i) => i !== enumIndex),
                      });
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </Card>

      {showOutput && (
        <SchemaOutput
          schemaJson={generateSchemaJSON(schema, isStrictMode)}
          onCopySchema={handleCopySchema}
          hasErrors={validationErrors.length > 0}
        />
      )}
    </div>
  );
};

export default SchemaBuilder;
