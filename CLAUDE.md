---
name: Form Builder
description: A modern drag-and-drop form builder component that enables users to visually create and configure forms with multiple field types, real-time editing, and JSON schema export
keywords: form, builder, drag-and-drop, fields, schema, visual editor, form creator
---

#### Form Builder

***Purpose:***
A comprehensive form builder component that provides an intuitive visual interface for creating and configuring forms. Users can drag field types from a palette onto a canvas, configure field properties in real-time, preview the form, and export the schema as JSON for integration with other systems.

***Features:***
- Visual drag-and-drop interface with three-panel layout (palette, canvas, properties)
- 8 field types: Text Input, Textarea, Number, Email, Select, Checkbox, Radio, Date
- Real-time field configuration with type-specific options
- Field reordering, duplication, and deletion
- Live form preview in modal
- Automatic unique ID generation and validation
- Required field indicators and help text support
- Export/Import JSON schema functionality
- Clear all fields with confirmation
- Responsive design with smooth animations

***Properties:***
- initialSchema: object|null - Optional initial form schema to load on mount. Should contain a "fields" array with field definitions.

***Events:***
- change: Triggered when the form schema changes (fields added, removed, or modified). Payload: { "value": formSchemaObject }
- clear: Triggered when all fields are cleared. Payload: { "value": true }

***Exposed Actions:***
- `exportSchema`: Returns the current form schema as JSON. No arguments.
- `importSchema`: Imports a form schema. Args: schema (object with "fields" array)
- `clearAllFields`: Clears all fields from the form builder. No arguments.

***Exposed Variables:***
- formSchema: The complete form schema object containing all field definitions. (path: variables['[uid]-formSchema'])

***Field Types and Configuration:***

**Text Input:**
- Label, Field ID, Placeholder, Required, Help Text, Max Length

**Textarea:**
- Label, Field ID, Placeholder, Required, Help Text, Max Length

**Number:**
- Label, Field ID, Placeholder, Required, Help Text, Min, Max, Step

**Email:**
- Label, Field ID, Placeholder, Required, Help Text

**Select:**
- Label, Field ID, Placeholder, Required, Help Text, Options (label/value pairs)

**Checkbox:**
- Label, Field ID, Placeholder, Required, Help Text

**Radio:**
- Label, Field ID, Required, Help Text, Options (label/value pairs)

**Date:**
- Label, Field ID, Placeholder, Required, Help Text

***Form Schema Structure:***
```json
{
  "fields": [
    {
      "id": "unique-uuid",
      "type": "text|textarea|number|email|select|checkbox|radio|date",
      "label": "Field Label",
      "fieldId": "field_identifier",
      "placeholder": "Placeholder text",
      "required": true|false,
      "helpText": "Help text",
      "options": [{"label": "Option 1", "value": "opt1"}],
      "min": 0,
      "max": 100,
      "step": 1,
      "maxLength": 255
    }
  ]
}
```

***Notes:***
- The component uses vuedraggable for drag-and-drop functionality
- Field IDs are automatically generated but can be manually edited
- Duplicate field IDs are allowed but should be made unique by the user
- The form schema is automatically updated in real-time as changes are made
- Preview modal shows a functional form with all configured fields
- The component is fully responsive and adapts to different screen sizes
- All field configurations are persisted in the formSchema variable
- Import/Export functionality allows saving and loading form configurations