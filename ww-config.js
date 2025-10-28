export default {
editor: {
label: {
en: 'Construtor de Formulários',
pt: 'Construtor de Formulários'
},
icon: 'collection'
},
properties: {
initialSchema: {
label: {
en: 'Esquema Inicial',
pt: 'Esquema Inicial'
},
type: 'Object',
section: 'settings',
bindable: true,
defaultValue: null,
hidden: true,
/* wwEditor:start */
bindingValidation: {
type: 'object',
tooltip: 'Vincule a um objeto com um array "fields" para inicializar o construtor de formulários com campos existentes'
},
propertyHelp: {
tooltip: 'Esquema de formulário inicial opcional para carregar quando o componente for montado. Deve conter um array "fields" com definições de campos.'
}
/* wwEditor:end */
}
},
triggerEvents: [
{
name: 'change',
label: {
en: 'Ao alterar formulário',
pt: 'Ao alterar formulário'
},
event: { value: null },
default: true
},
{
name: 'save',
label: {
en: 'Ao salvar formulário',
pt: 'Ao salvar formulário'
},
event: {
schema: null,
fieldsCount: 0
}
},
{
name: 'clear',
label: {
en: 'Ao limpar tudo',
pt: 'Ao limpar tudo'
},
event: { value: null }
}
],
actions: [
{
label: {
en: 'Exportar Esquema',
pt: 'Exportar Esquema'
},
action: 'exportSchema'
},
{
label: {
en: 'Importar Esquema',
pt: 'Importar Esquema'
},
action: 'importSchema',
args: [
{
name: 'schema',
type: 'object'
}
]
},
{
label: {
en: 'Limpar Todos os Campos',
pt: 'Limpar Todos os Campos'
},
action: 'clearAllFields'
}
]
};