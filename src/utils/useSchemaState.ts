import { useState } from "react";
import { SchemaDefinition, SchemaProperty } from "../types/schema";
import { arrayMove } from "@dnd-kit/sortable";

const defaultSchema: SchemaDefinition = {
  properties: [],
  additionalProperties: false,
};

export const useSchemaState = (
  initialSchema: SchemaDefinition = defaultSchema,
  initialStrictMode = true
) => {
  const [schema, setSchema] = useState<SchemaDefinition>(initialSchema);
  const [isStrictMode, setIsStrictMode] = useState(initialStrictMode);
  const [enumInputValues, setEnumInputValues] = useState<{ [key: number]: string }>({});

  const addProperty = () => {
    setSchema((prev) => ({
      ...prev,
      properties: [
        ...prev.properties,
        {
          name: "",
          type: "string",
          required: isStrictMode,
          hasEnum: false,
          enum: [],
        },
      ],
    }));
  };

  const removeProperty = (index: number) => {
    setSchema((prev) => ({
      ...prev,
      properties: prev.properties.filter((_, i) => i !== index),
    }));
  };

  const updateProperty = (index: number, updates: Partial<SchemaProperty>) => {
    setSchema((prev) => ({
      ...prev,
      properties: prev.properties.map((prop, i) => {
        if (i !== index) return prop;
        
        if (updates.type && updates.type !== prop.type) {
          return {
            ...prop,
            ...updates,
            hasEnum: false,
            enum: [],
          };
        }
        
        return { ...prop, ...updates };
      })
    }));
  };

  const handlePropertyReorder = (oldIndex: number, newIndex: number) => {
    setSchema((prev) => ({
      ...prev,
      properties: arrayMove(prev.properties, oldIndex, newIndex),
    }));
  };

  const handleStrictModeChange = (checked: boolean) => {
    setIsStrictMode(checked);
    setSchema((prev) => ({
      ...prev,
      properties: prev.properties.map(prop => ({
        ...prop,
        required: checked ? true : prop.required
      }))
    }));
  };

  // Return an object with all state and methods
  return {
    schema,
    isStrictMode,
    enumInputValues,
    setEnumInputValues,
    addProperty,
    removeProperty,
    updateProperty,
    handlePropertyReorder,
    handleStrictModeChange,
  };
};
