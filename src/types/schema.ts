
export type SchemaProperty = {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
  required: boolean;
  hasEnum: boolean;
  enum?: (string | number)[];
  items?: {
    type: "string" | "number" | "boolean" | "object";
  };
  properties?: SchemaProperty[];  // For nested object properties
  additionalObjectProperties?: boolean;  // For nested object additionalProperties
};

export type SchemaDefinition = {
  properties: SchemaProperty[];
  additionalProperties: boolean;
};
