import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Copy, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";

interface SchemaHeaderProps {
  isStrictMode: boolean;
  hasErrors: boolean;
  schemaName: string;
  onStrictModeChange: (checked: boolean) => void;
  onSchemaNameChange: (name: string) => void;
  onAddProperty: () => void;
  onCopySchema: () => void;
}

export const SchemaHeader = ({
  isStrictMode,
  hasErrors,
  schemaName,
  onStrictModeChange,
  onSchemaNameChange,
  onAddProperty,
  onCopySchema,
}: SchemaHeaderProps) => {
  const [nameError, setNameError] = useState<string | null>(null);
  
  const validateSchemaName = (name: string) => {
    const pattern = /^[a-zA-Z0-9_-]+$/;
    if (name && !pattern.test(name)) {
      setNameError("Schema name can only contain alphanumeric characters, underscores, and hyphens");
      return false;
    }
    setNameError(null);
    return true;
  };
  
  const handleNameChange = (name: string) => {
    validateSchemaName(name);
    onSchemaNameChange(name);
  };
  
  useEffect(() => {
    validateSchemaName(schemaName);
  }, [schemaName]);
  
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Schema Builder</h2>
          <div className="flex items-center gap-2">
            <Switch
              checked={isStrictMode}
              onCheckedChange={onStrictModeChange}
            />
            <span className="text-sm">Strict Mode</span>
          </div>
        </div>
        <div className="flex items-end gap-2">
        <Button
            variant="outline"
            size="sm"
            onClick={onCopySchema}
            className="flex items-center gap-2"
            disabled={hasErrors || nameError !== null}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            onClick={onAddProperty} 
            size="sm" 
            className="flex items-center gap-2"
            disabled={nameError !== null}
          >
            <Plus className="w-4 h-4" />
            Add Property
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Input
          id="schema-name"
          value={schemaName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Schema Definition Name"
          className={`max-w-xs ${nameError ? 'border-red-500' : ''}`}
        />
        {nameError && <p className="text-sm text-red-500">{nameError}</p>}
      </div>
    </div>
  );
};
