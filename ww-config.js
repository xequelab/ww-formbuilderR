export default {
editor: {
label: {
en: 'Form Builder'
},
icon: 'collection'
},
properties: {
initialSchema: {
label: {
en: 'Initial Schema'
},
type: 'Object',
section: 'settings',
bindable: true,
defaultValue: null,
hidden: true,
/* wwEditor:start */
bindingValidation: {
type: 'object',
tooltip: 'Bind to an object with a "fields" array to initialize the form builder with existing fields'
},
propertyHelp: {
tooltip: 'Optional initial form schema to load when the component mounts. Should contain a "fields" array with field definitions.'
}
/* wwEditor:end */
}
},
triggerEvents: [
{
name: 'change',
label: { en: 'On form change' },
event: { value: null },
default: true
},
{
name: 'clear',
label: { en: 'On clear all' },
event: { value: null }
}
],
actions: [
{
label: { en: 'Export Schema' },
action: 'exportSchema'
},
{
label: { en: 'Import Schema' },
action: 'importSchema',
args: [
{
name: 'schema',
type: 'object'
}
]
},
{
label: { en: 'Clear All Fields' },
action: 'clearAllFields'
}
]
};