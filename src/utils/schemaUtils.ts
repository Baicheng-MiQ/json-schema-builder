import { SchemaDefinition, SchemaProperty } from "../types/schema";

type PropertySchema = {
  type: string;
  description?: string;
  enum?: (string | number)[];
  items?: { type: string };
  properties?: Record<string, PropertySchema>;
  required?: string[];
  additionalProperties?: boolean;
};

function generatePropertySchema(prop: SchemaProperty): PropertySchema {
  const schema: PropertySchema = {
    type: prop.type,
  };

  if (prop.description) {
    schema.description = prop.description;
  }

  if (prop.hasEnum && prop.enum && prop.enum.length > 0) {
    schema.enum = prop.type === "number" ? prop.enum.map(v => Number(v)) : prop.enum;
  }

  if (prop.type === "array" && prop.items) {
    schema.items = {
      type: prop.items.type
    };
  }

  if (prop.type === "object" && prop.properties) {
    schema.properties = prop.properties.reduce(
      (acc, nestedProp) => ({
        ...acc,
        [nestedProp.name]: generatePropertySchema(nestedProp)
      }),
      {}
    );
    schema.required = prop.properties.filter(p => p.required).map(p => p.name);
    schema.additionalProperties = prop.additionalObjectProperties ?? false;
  }

  return schema;
}

export function generateSchemaJSON(schema: SchemaDefinition, isStrictMode: boolean, schemaName: string = "schema_definition"): string {
  const schemaContent = {
    type: "object",
    properties: schema.properties.reduce(
      (acc, prop) => ({
        ...acc,
        [prop.name]: generatePropertySchema(prop)
      }),
      {}
    ),
    required: schema.properties.filter((p) => p.required).map((p) => p.name),
    additionalProperties: schema.additionalProperties,
  };

  const openAISchema = {
    name: schemaName,
    strict: isStrictMode,
    schema: schemaContent,
  };

  return JSON.stringify(openAISchema, null, 2);
}

export type ValidationError = {
  path: string;
  message: string;
};

export function validateSchema(schema: SchemaDefinition): ValidationError[] {
  const errors: ValidationError[] = [];
  const propertyNames = new Set<string>();

  const validateProperty = (prop: SchemaProperty, path: string) => {
    // Check empty name
    if (!prop.name.trim()) {
      errors.push({
        path,
        message: "Property name cannot be empty"
      });
    }

    // Check duplicate names
    if (propertyNames.has(prop.name)) {
      errors.push({
        path,
        message: `Duplicate property name: ${prop.name}`
      });
    }
    propertyNames.add(prop.name);

    // Check empty enums
    if (prop.hasEnum && (!prop.enum || prop.enum.length === 0)) {
      errors.push({
        path,
        message: "Enum is enabled but no values are defined"
      });
    }

    // Validate nested object properties
    if (prop.type === "object" && prop.properties) {
      prop.properties.forEach((nestedProp, index) => {
        validateProperty(nestedProp, `${path}.${prop.name}[${index}]`);
      });
    }
  };

  schema.properties.forEach((prop, index) => {
    validateProperty(prop, `root[${index}]`);
  });

  return errors;
}
