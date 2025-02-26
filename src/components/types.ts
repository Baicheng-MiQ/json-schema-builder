
import { SchemaProperty } from "../types/schema";

export interface PropertyEditorProps {
  property: SchemaProperty;
  index: number;
  isStrictMode: boolean;
  enumInputValue: string;
  onPropertyUpdate: (index: number, updates: Partial<SchemaProperty>) => void;
  onRemoveProperty: (index: number) => void;
  onEnumInputChange: (index: number, value: string) => void;
  onAddEnumValue: (index: number) => void;
  onRemoveEnumValue: (propertyIndex: number, enumIndex: number) => void;
  nestingLevel?: number;
}
