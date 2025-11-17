export default {
editor: {
label: {
en: 'Construtor de Formulários',
pt: 'Construtor de Formulários'
},
icon: 'collection'
},
properties: {
serviceName: {
label: {
en: 'Nome do Serviço',
pt: 'Nome do Serviço'
},
type: 'Text',
section: 'settings',
bindable: true,
defaultValue: '',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Nome do serviço ao qual este formulário pertence'
},
propertyHelp: {
tooltip: 'Identificação do serviço ao qual este formulário está associado. Exibido no cabeçalho do construtor.'
}
/* wwEditor:end */
},
initialSchema: {
label: {
en: 'Esquema Inicial',
pt: 'Esquema Inicial'
},
type: 'Object',
section: 'settings',
bindable: true,
defaultValue: null,
/* wwEditor:start */
bindingValidation: {
type: 'object',
tooltip: 'Vincule a um objeto que contenha a propriedade "schema" (string JSON) ou diretamente um objeto com "fields"'
},
propertyHelp: {
tooltip: 'Esquema inicial para carregar o formulário. Aceita objeto com propriedade "schema" (string JSON) ou objeto direto com array "fields".'
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
},
{
name: 'close',
label: {
en: 'Ao fechar',
pt: 'Ao fechar'
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